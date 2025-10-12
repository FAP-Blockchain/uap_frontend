import { Layout, Menu } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminRoutes,
  publicPortalRoutes,
  studentPortalRoutes,
  teacherRoutes,
} from "../config/appRoutes";
import { ROLE_CODES } from "../constants/roles";
import {
  getMainNavItems,
  getToolsNavItems,
  SECTION_TITLES,
  type MenuItem,
} from "../utils/menuUtils";
import "./index.scss";

const { Sider } = Layout;

interface SiderProps {
  collapsed: boolean;
}

const SiderComponent: React.FC<SiderProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const pathname = window?.location?.pathname || "";
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Get user info from Redux
  // const { userProfile } = useSelector((state: RootState) => state.auth);
  // const userRole = (userProfile?.roleCode || "") as RoleCode;

  const userRole = ROLE_CODES.ADMIN;

  // Generate menu items from App routes (memoized for performance)
  const mainNavItems = useMemo(
    () =>
      getMainNavItems(
        adminRoutes,
        studentPortalRoutes,
        teacherRoutes,
        publicPortalRoutes
      ),
    []
  );

  const toolsNavItems = useMemo(() => getToolsNavItems(adminRoutes), []);

  // Debug: Log menu items
  console.log("🔍 Debug Info:", {
    userRole,
    totalMainItems: mainNavItems.length,
    totalToolsItems: toolsNavItems.length,
    mainItems: mainNavItems.map((item) => ({
      label: item.label,
      allowedRoles: item.allowedRoles,
    })),
  });

  // Check if user has permission to access a menu item
  const hasPermission = useMemo(
    () =>
      (item: MenuItem): boolean => {
        // If no restrictions, everyone can access
        if (!item.allowedRoles && !item.requiredPermissions) {
          return true;
        }

        // Check role-based access
        if (item.allowedRoles && item.allowedRoles.length > 0) {
          return item.allowedRoles.includes(userRole);
        }

        // Default: allow access (can be changed to deny by default)
        return true;
      },
    [userRole]
  );

  // Get current selected menu item based on path
  useEffect(() => {
    if (pathname) {
      // For the home page
      if (pathname === "/admin" || pathname === "/admin/") {
        setSelectedKeys(["/admin/dashboard"]);
      }
      // For specific admin pages, match with the second path segment
      else if (pathname.startsWith("/admin/")) {
        const pathSegments = pathname.split("/");
        if (pathSegments.length >= 3) {
          // Handle danh-muc sub-items
          if (pathSegments[2] === "danh-muc" && pathSegments.length >= 4) {
            setSelectedKeys([`/admin/danh-muc/${pathSegments[3]}`]);
          } else {
            setSelectedKeys([`/admin/${pathSegments[2]}`]);
          }
        }
      }
    }
    setMounted(true);
  }, [pathname]);

  // Filter menu items based on user permissions
  const filteredMainNavItems = useMemo(
    () => mainNavItems.filter(hasPermission),
    [mainNavItems, hasPermission]
  );

  const filteredToolsNavItems = useMemo(
    () => toolsNavItems.filter(hasPermission),
    [toolsNavItems, hasPermission]
  );

  // Debug: Log filtered items
  console.log("✅ Filtered Items:", {
    filteredMain: filteredMainNavItems.length,
    filteredTools: filteredToolsNavItems.length,
    filteredMainLabels: filteredMainNavItems.map((item) => item.label),
  });

  // Prevent hydration mismatch by returning minimal sidebar
  if (!mounted) {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={true}
        width={240}
        className="sidebar-layout"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 64,
          bottom: 0,
        }}
      />
    );
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      className="sidebar-layout"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 64, // Height of the header
        bottom: 0,
      }}
    >
      <div className="sidebar-menu-container">
        {/* Main Navigation - Filtered by user permissions */}
        {filteredMainNavItems.length > 0 && (
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={selectedKeys}
            onClick={({ key }) => navigate(key)}
            className="sidebar-menu"
            items={filteredMainNavItems.map((item) => ({
              ...item,
              style: {
                "--item-index": item["data-index"],
              } as React.CSSProperties,
            }))}
          />
        )}

        {/* Tools Section - Filtered by user permissions */}
        {!collapsed && filteredToolsNavItems.length > 0 && (
          <>
            <div className="menu-divider" />
            <div className="sidebar-section-title">{SECTION_TITLES.TOOLS}</div>
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={selectedKeys}
              className="sidebar-menu"
              items={filteredToolsNavItems.map((item) => ({
                ...item,
                style: {
                  "--item-index": item["data-index"],
                } as React.CSSProperties,
              }))}
              onClick={({ key }) => navigate(key)}
            />
          </>
        )}

        {/* Footer Section */}
        {!collapsed && (
          <>
            <div className="menu-divider" />
            <div className="sidebar-footer">
              <div className="footer-link">Trợ giúp</div>
              <div className="footer-link">Hỗ trợ</div>
              <div className="footer-link">Liên hệ</div>
              <div className="footer-link">Điều khoản</div>
              <div className="footer-link">Chính sách</div>
              <div className="footer-copyright">
                © 2024 FAP Blockchain System
              </div>
            </div>
          </>
        )}
      </div>
    </Sider>
  );
};

export default SiderComponent;
