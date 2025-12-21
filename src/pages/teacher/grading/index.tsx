import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Table,
  Button,
  Select,
  Space,
  Avatar,
  InputNumber,
  Alert,
  message,
  Tabs,
  Spin,
  notification,
} from "antd";
import { EditOutlined, DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { ColumnsType } from "antd/es/table";
import {
  getTeacherClassesApi,
  getClassByIdApi,
  getGradeComponentsApi,
  getClassGradesApi,
  updateStudentGradesApi,
  prepareGradeOnChainApi,
  saveGradeOnChainApi,
  type TeachingClass,
  type ClassStudent,
  type GradeComponent,
  type ClassDetail,
} from "../../../services/teacher/grading/api";
import { getGradeManagementContract } from "../../../blockchain/grade";
import type { GradeManagementContract } from "../../../blockchain/grade";
import "./index.scss";

const { Option } = Select;
const { TabPane } = Tabs;

interface StudentGrade {
  studentId: string;
  [key: string]: string | number; // gradeComponentId -> score hoặc gradeId
}

interface GradeIdMap {
  [studentId: string]: {
    [gradeComponentId: string]: string; // gradeComponentId -> gradeId
  };
}

interface GradeOnChainStatusMap {
  [studentId: string]: {
    [gradeComponentId: string]: boolean; // true nếu điểm đã on-chain
  };
}

const TeacherGrading: React.FC = () => {
  const [classes, setClasses] = useState<TeachingClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<ClassDetail | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [gradeComponents, setGradeComponents] = useState<GradeComponent[]>([]);
  const [studentGrades, setStudentGrades] = useState<
    Record<string, StudentGrade>
  >({});
  const [gradeIdMap, setGradeIdMap] = useState<GradeIdMap>({});
  const [gradeOnChainStatus, setGradeOnChainStatus] = useState<GradeOnChainStatusMap>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingClassData, setLoadingClassData] = useState(false);
  const [activeTab, setActiveTab] = useState("grading");
  const hasLoadedClassesRef = useRef(false);
  const [api, contextHolder] = notification.useNotification();
  const [onChainLoading, setOnChainLoading] = useState<Record<string, boolean>>({});

  // Load teacher's classes on mount (avoid double-call in React StrictMode)
  useEffect(() => {
    if (!hasLoadedClassesRef.current) {
      hasLoadedClassesRef.current = true;
      loadTeacherClasses();
    }
  }, []);

  // Load class data when class is selected
  useEffect(() => {
    if (selectedClassId) {
      loadClassData(selectedClassId);
    }
  }, [selectedClassId]);

  const loadTeacherClasses = async () => {
    setLoadingClasses(true);
    try {
      const teacherClasses = await getTeacherClassesApi();
      const normalizedClasses = Array.isArray(teacherClasses)
        ? teacherClasses
        : [];
      setClasses(normalizedClasses);
      if (normalizedClasses.length > 0) {
        setSelectedClassId(normalizedClasses[0].classId);
      }
    } catch (error) {
      console.error("Error loading teacher classes:", error);
      message.error("Không thể tải danh sách lớp học");
    } finally {
      setLoadingClasses(false);
    }
  };

  const loadClassData = async (classId: string) => {
    setLoadingClassData(true);
    try {
      const [classData, existingGrades] = await Promise.all([
        getClassByIdApi(classId),
        getClassGradesApi(classId).catch(() => []), // Load existing grades if available
      ]);

      setSelectedClass(classData);
      setStudents(classData.students || []);

      // Load grade components for this subject
      if (classData.subjectId) {
        const components = await getGradeComponentsApi(classData.subjectId);
        setGradeComponents(components || []);
      }

      // Initialize student grades and gradeIdMap from existing grades
      const initialGrades: Record<string, StudentGrade> = {};
      const initialGradeIdMap: GradeIdMap = {};
      const initialOnChainStatus: GradeOnChainStatusMap = {};

      (classData.students || []).forEach((student) => {
        initialGrades[student.studentId] = {
          studentId: student.studentId,
        };
        initialGradeIdMap[student.studentId] = {};
        initialOnChainStatus[student.studentId] = {};
      });

      // Populate with existing grades
      existingGrades.forEach((grade) => {
        if (initialGrades[grade.studentId]) {
          initialGrades[grade.studentId][grade.gradeComponentId] = grade.score;
        }
        if (!initialGradeIdMap[grade.studentId]) {
          initialGradeIdMap[grade.studentId] = {};
        }
        initialGradeIdMap[grade.studentId][grade.gradeComponentId] =
          grade.gradeId;

        if (!initialOnChainStatus[grade.studentId]) {
          initialOnChainStatus[grade.studentId] = {};
        }
        initialOnChainStatus[grade.studentId][grade.gradeComponentId] =
          !!grade.onChainTxHash || !!grade.onChainGradeId;
      });

      setStudentGrades(initialGrades);
      setGradeIdMap(initialGradeIdMap);
      setGradeOnChainStatus(initialOnChainStatus);
    } catch (error) {
      console.error("Error loading class data:", error);
      message.error("Không thể tải thông tin lớp học");
    } finally {
      setLoadingClassData(false);
    }
  };

  const updateStudentGrade = (
    studentId: string,
    gradeComponentId: string,
    score: number
  ) => {
    setStudentGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        [gradeComponentId]: score,
      },
    }));
  };

  const handleUpdateStudentGrades = async (student: ClassStudent) => {
    if (!selectedClass || !selectedClass.subjectId) {
      message.error("Vui lòng chọn lớp học");
      return;
    }

    const studentGrade = studentGrades[student.studentId] || {};
    const studentGradeIds = gradeIdMap[student.studentId] || {};

    const gradesToUpdate: Array<{
      gradeId: string;
      score: number;
    }> = [];
    const missingGradeComponents: string[] = [];

    gradeComponents.forEach((component) => {
      const scoreRaw = studentGrade[component.id];
      const score =
        typeof scoreRaw === "number" ? scoreRaw : Number(scoreRaw) || 0;
      const gradeId = studentGradeIds[component.id];

      if (gradeId) {
        gradesToUpdate.push({
          gradeId,
          score,
        });
      } else {
        missingGradeComponents.push(component.name);
      }
    });

    if (missingGradeComponents.length > 0) {
      message.warning(
        `Không tìm thấy mã điểm cho: ${missingGradeComponents.join(", ")}`
      );
    }

    if (gradesToUpdate.length === 0) {
      message.warning("Không có điểm nào để cập nhật");
      return;
    }

    setLoading((prev) => ({ ...prev, [student.studentId]: true }));
    try {
      const updateRequest = {
        grades: gradesToUpdate,
      };
      await updateStudentGradesApi(updateRequest);

      // Hiển thị thông báo thành công
      api.success({
        message: "Cập nhật điểm thành công",
        description: `Điểm của sinh viên ${student.fullName} đã được cập nhật thành công.`,
        placement: "topRight",
        duration: 4,
      });
    } catch (error: unknown) {
      console.error("Error saving/updating grades:", error);

      // Lấy thông báo lỗi từ API response
      const errorMessage =
        (
          error as {
            response?: { data?: { detail?: string; message?: string } };
          }
        )?.response?.data?.detail ||
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as { message?: string })?.message ||
        "Có lỗi xảy ra khi cập nhật điểm. Vui lòng thử lại.";

      api.error({
        message: "Lỗi cập nhật điểm",
        description: errorMessage,
        placement: "topRight",
        duration: 5,
      });
    } finally {
      setLoading((prev) => ({ ...prev, [student.studentId]: false }));
    }
  };

  const handleRecordGradeOnChain = async (
    student: ClassStudent,
    gradeComponentId: string
  ) => {
    const gradeId = gradeIdMap[student.studentId]?.[gradeComponentId];
    if (!gradeId) {
      message.warning("Chưa có mã điểm để đưa on-chain (hãy lưu điểm trước)");
      return;
    }

    const key = `${student.studentId}_${gradeComponentId}`;
    setOnChainLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const prepareDto = await prepareGradeOnChainApi(gradeId);
      if (!prepareDto) {
        message.error("Backend không thể chuẩn bị payload on-chain cho điểm này");
        return;
      }

      const contract: GradeManagementContract = await getGradeManagementContract();

      const tx = await contract.recordGrade(
        BigInt(prepareDto.onChainClassId),
        prepareDto.studentWalletAddress,
        prepareDto.componentName,
        BigInt(prepareDto.onChainScore),
        BigInt(prepareDto.onChainMaxScore)
      );

      const receipt = await tx.wait();

      let onChainGradeId: number | undefined;
      try {
        const event = contract.interface.getEvent("GradeRecorded");
        const topic = event?.topicHash;
        for (const log of receipt.logs) {
          if (topic && log.topics[0] === topic) {
            const parsed = contract.interface.parseLog(log);
            const gradeIdFromEvent = parsed?.args?.[0];
            if (gradeIdFromEvent !== undefined) {
              onChainGradeId = Number(gradeIdFromEvent);
              break;
            }
          }
        }
      } catch (e) {
        console.error("Không parse được GradeRecorded event", e);
      }

      await saveGradeOnChainApi(gradeId, {
        transactionHash: receipt.hash,
        blockNumber: Number(receipt.blockNumber ?? 0),
        chainId: Number(tx.chainId ?? 0),
        contractAddress: contract.target.toString(),
        onChainGradeId,
      });

      // Cập nhật trạng thái on-chain trong UI
      setGradeOnChainStatus((prev) => ({
        ...prev,
        [student.studentId]: {
          ...(prev[student.studentId] || {}),
          [gradeComponentId]: true,
        },
      }));

      api.success({
        message: "Đưa điểm lên blockchain thành công",
        description: `Sinh viên ${student.fullName} - ${prepareDto.componentName}`,
        placement: "topRight",
        duration: 4,
      });
    } catch (error: any) {
      console.error("Error recording grade on-chain", error);

      const metamaskMsg =
        error?.reason ||
        error?.data?.message ||
        error?.message ||
        "Có lỗi khi gọi hợp đồng GradeManagement";

      api.error({
        message: "Lỗi đưa điểm lên blockchain",
        description: metamaskMsg,
        placement: "topRight",
        duration: 6,
      });
    } finally {
      setOnChainLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Build dynamic columns based on grade components
  const buildColumns = (): ColumnsType<ClassStudent> => {
    const baseColumns: ColumnsType<ClassStudent> = [
      {
        title: "STT",
        key: "index",
        render: (_, __, index) => index + 1,
        width: 60,
        fixed: "left",
      },
      {
        title: "Sinh viên",
        key: "student",
        fixed: "left",
        width: 200,
        render: (_, student) => (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar size="large" style={{ backgroundColor: "#1890ff" }}>
              {student.fullName.charAt(0)}
            </Avatar>
            <div>
              <div style={{ fontWeight: 500 }}>{student.fullName}</div>
              <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                {student.studentCode}
              </div>
            </div>
          </div>
        ),
      },
    ];

    // Add columns for each grade component
    const componentColumns = gradeComponents.map((component) => ({
      title: (
        <div>
          <div>{component.name}</div>
          <div style={{ fontSize: 11, color: "#ffffff", fontWeight: 500 }}>
            {component.weightPercent}%
          </div>
        </div>
      ),
      key: `component_${component.id}`,
      width: 150,
      render: (_: unknown, student: ClassStudent) => {
        const studentGrade = studentGrades[student.studentId] || {};
        const score = Number(studentGrade[component.id]) || 0;
        const maxScore = component.maxScore || 10;
        const onChainKey = `${student.studentId}_${component.id}`;
        const isOnChainLoading = onChainLoading[onChainKey] || false;
        const isOnChainDone =
          gradeOnChainStatus[student.studentId]?.[component.id] || false;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <InputNumber
              min={0}
              max={maxScore}
              value={score}
              onChange={(value) => {
                if (value !== null) {
                  updateStudentGrade(student.studentId, component.id, value);
                }
              }}
              style={{ width: 80 }}
              precision={1}
            />
            <span style={{ color: "#8c8c8c" }}>/ {maxScore}</span>
            <Button
              type={isOnChainDone ? "default" : "link"}
              size="small"
              loading={isOnChainLoading}
              onClick={() => handleRecordGradeOnChain(student, component.id)}
              disabled={isOnChainDone}
            >
              {isOnChainDone ? "Đã on-chain" : "On-chain"}
            </Button>
          </div>
        );
      },
    }));

    // Add actions column
    const actionsColumn: ColumnsType<ClassStudent>[number] = {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_: unknown, student: ClassStudent) => {
        const studentLoading = loading[student.studentId] || false;

        return (
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleUpdateStudentGrades(student)}
            loading={studentLoading}
            className="update-grade-btn"
          >
            Cập nhật điểm
          </Button>
        );
      },
    };

    return [...baseColumns, ...componentColumns, actionsColumn];
  };

  const columns = buildColumns();

  const handleExportPDF = async () => {
    if (!selectedClass || students.length === 0) {
      message.warning("Vui lòng chọn lớp học và đảm bảo có dữ liệu để xuất");
      return;
    }

    try {
      message.loading({ content: "Đang tạo PDF...", key: "export-pdf" });

      // Create a temporary container for the PDF table
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "1200px"; // Landscape A4 width in pixels
      container.style.backgroundColor = "#ffffff";
      container.style.padding = "20px";
      container.style.fontFamily = "Arial, sans-serif";
      document.body.appendChild(container);

      // Create header
      const header = document.createElement("div");
      header.style.textAlign = "center";
      header.style.marginBottom = "20px";
      
      const title = document.createElement("h1");
      title.textContent = "BẢNG ĐIỂM";
      title.style.fontSize = "24px";
      title.style.fontWeight = "bold";
      title.style.margin = "0 0 15px 0";
      title.style.color = "#000000";
      header.appendChild(title);

      const infoDiv = document.createElement("div");
      infoDiv.style.textAlign = "left";
      infoDiv.style.fontSize = "14px";
      infoDiv.style.lineHeight = "1.8";
      infoDiv.style.marginBottom = "10px";
      infoDiv.innerHTML = `
        <div><strong>Lớp:</strong> ${selectedClass.classCode}</div>
        <div><strong>Môn học:</strong> ${selectedClass.subjectName}</div>
        <div><strong>Học kỳ:</strong> ${selectedClass.semesterName || "N/A"}</div>
        <div><strong>Giảng viên:</strong> ${selectedClass.teacherName || "N/A"}</div>
      `;
      header.appendChild(infoDiv);
      container.appendChild(header);

      // Create table
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.fontSize = "12px";
      table.style.border = "1px solid #ddd";

      // Create header row
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      headerRow.style.backgroundColor = "#1890ff";
      headerRow.style.color = "#ffffff";
      headerRow.style.fontWeight = "bold";

      const headers = ["STT", "Mã SV", "Họ và tên"];
      gradeComponents.forEach((component) => {
        headers.push(`${component.name} (${component.weightPercent}%)`);
      });
      headers.push("Tổng điểm");

      headers.forEach((headerText) => {
        const th = document.createElement("th");
        // Check if header contains percentage (e.g., "Assignment 1 (10%)")
        if (headerText.includes("(") && headerText.includes("%")) {
          // Split to separate the name and percentage
          const parts = headerText.split("(");
          const name = parts[0].trim();
          const percentage = "(" + parts[1];
          
          th.innerHTML = `${name} <span style="color: #ffffff; font-weight: bold;">${percentage}</span>`;
        } else {
          th.textContent = headerText;
        }
        th.style.padding = "10px 8px";
        th.style.border = "1px solid #ddd";
        th.style.textAlign = "center";
        th.style.color = "#ffffff";
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create body
      const tbody = document.createElement("tbody");
      students.forEach((student, index) => {
        const row = document.createElement("tr");
        if (index % 2 === 1) {
          row.style.backgroundColor = "#f5f7fa";
        }

        // Calculate grades
        let totalScore = 0;
        let totalWeight = 0;
        const gradeCells: string[] = [];

        gradeComponents.forEach((component) => {
          const studentGrade = studentGrades[student.studentId] || {};
          const score = Number(studentGrade[component.id]) || 0;
          const maxScore = component.maxScore || 10;
          const weight = component.weightPercent || 0;

          const weightedScore = (score / maxScore) * weight;
          totalScore += weightedScore;
          totalWeight += weight;

          gradeCells.push(`${score}/${maxScore}`);
        });

        const finalGrade = totalWeight > 0 ? (totalScore / totalWeight) * 10 : 0;

        // STT
        const cell1 = document.createElement("td");
        cell1.textContent = String(index + 1);
        cell1.style.padding = "8px";
        cell1.style.border = "1px solid #ddd";
        cell1.style.textAlign = "center";
        row.appendChild(cell1);

        // Mã SV
        const cell2 = document.createElement("td");
        cell2.textContent = student.studentCode;
        cell2.style.padding = "8px";
        cell2.style.border = "1px solid #ddd";
        cell2.style.textAlign = "center";
        row.appendChild(cell2);

        // Họ và tên
        const cell3 = document.createElement("td");
        cell3.textContent = student.fullName;
        cell3.style.padding = "8px";
        cell3.style.border = "1px solid #ddd";
        cell3.style.textAlign = "left";
        row.appendChild(cell3);

        // Grade components
        gradeCells.forEach((gradeText) => {
          const cell = document.createElement("td");
          cell.textContent = gradeText;
          cell.style.padding = "8px";
          cell.style.border = "1px solid #ddd";
          cell.style.textAlign = "center";
          row.appendChild(cell);
        });

        // Tổng điểm
        const totalCell = document.createElement("td");
        totalCell.textContent = finalGrade.toFixed(2);
        totalCell.style.padding = "8px";
        totalCell.style.border = "1px solid #ddd";
        totalCell.style.textAlign = "center";
        totalCell.style.fontWeight = "bold";
        row.appendChild(totalCell);

        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      container.appendChild(table);

      // Footer
      const footer = document.createElement("div");
      footer.style.textAlign = "right";
      footer.style.marginTop = "20px";
      footer.style.fontSize = "11px";
      footer.style.color = "#666666";
      footer.style.fontStyle = "italic";
      footer.textContent = `Xuất ngày: ${new Date().toLocaleDateString("vi-VN")}`;
      container.appendChild(footer);

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Capture as image
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Create PDF
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const doc = new jsPDF("landscape", "mm", "a4");
      const pageHeight = doc.internal.pageSize.getHeight();
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      const fileName = `BangDiem_${selectedClass.classCode}_${new Date()
        .toISOString()
        .split("T")[0]}.pdf`;
      doc.save(fileName);

      message.success({ content: "Xuất bảng điểm thành công!", key: "export-pdf" });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      message.error({ content: "Có lỗi xảy ra khi xuất PDF. Vui lòng thử lại.", key: "export-pdf" });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="teacher-grading">
        <div className="grading-header">
          <h1>Chấm điểm </h1>
          <div className="grading-controls">
            <Space>
              <Spin spinning={loadingClasses}>
                <Select
                  value={selectedClassId}
                  onChange={setSelectedClassId}
                  style={{ width: 300 }}
                  placeholder="Chọn lớp học"
                  loading={loadingClasses}
                >
                  {classes.map((cls) => (
                    <Option key={cls.classId} value={cls.classId}>
                      {cls.classCode} - {cls.subjectName}
                    </Option>
                  ))}
                </Select>
              </Spin>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportPDF}
                disabled={!selectedClassId || students.length === 0}
                type="primary"
              >
                Xuất bảng điểm
              </Button>
            </Space>
          </div>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Chấm điểm" key="grading">
            <Spin spinning={loadingClassData}>
              {selectedClass && (
                <Alert
                  message={`Lớp: ${selectedClass.classCode} - ${selectedClass.subjectName}`}
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              )}

              {/* Grading Table */}
              <Card>
                <Table
                  dataSource={students}
                  columns={columns}
                  rowKey="studentId"
                  pagination={false}
                  size="middle"
                  scroll={{ x: 1200 }}
                  loading={loadingClassData}
                  className="grading-table"
                />
              </Card>
            </Spin>
          </TabPane>

          {/* <TabPane tab="Thống kê" key="statistics">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Phân bố điểm số" extra={<BarChartOutlined />}>
                <div
                  style={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ textAlign: "center", color: "#8c8c8c" }}>
                    <BarChartOutlined
                      style={{ fontSize: 48, marginBottom: 16 }}
                    />
                    <div>Biểu đồ phân bố điểm số</div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Tiến độ chấm điểm" extra={<TrophyOutlined />}>
                <div
                  style={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ textAlign: "center", color: "#8c8c8c" }}>
                    <TrophyOutlined
                      style={{ fontSize: 48, marginBottom: 16 }}
                    />
                    <div>Thống kê tiến độ chấm điểm</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane> */}
        </Tabs>
      </div>
    </>
  );
};

export default TeacherGrading;
