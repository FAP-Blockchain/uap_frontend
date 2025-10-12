/**
 * RoleGuard Component
 * Wrapper component for role-based conditional rendering
 */

import React from "react";
import { useRoleAccess } from "../../hooks/useRoleAccess";
import type { RoleCode, Permission } from "../../constants/roles";
import { Result, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: RoleCode[];
  requiredPermissions?: Permission[];
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
}

/**
 * Component to guard content based on user roles and permissions
 *
 * @example
 * // Guard by roles
 * <RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
 *   <AdminPanel />
 * </RoleGuard>
 *
 * @example
 * // Guard by permissions
 * <RoleGuard requiredPermissions={['manage_students']}>
 *   <StudentManagement />
 * </RoleGuard>
 *
 * @example
 * // With custom fallback
 * <RoleGuard allowedRoles={['ADMIN']} fallback={<p>Admin only</p>}>
 *   <AdminSettings />
 * </RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  fallback,
  showAccessDenied = false,
}) => {
  const { hasAnyRole, hasAllPermissions } = useRoleAccess();
  const navigate = useNavigate();

  // Check role-based access
  const hasRoleAccess = allowedRoles ? hasAnyRole(allowedRoles) : true;

  // Check permission-based access
  const hasPermissionAccess = requiredPermissions
    ? hasAllPermissions(requiredPermissions)
    : true;

  // User has access if they pass both checks
  const hasAccess = hasRoleAccess && hasPermissionAccess;

  if (!hasAccess) {
    // Show custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Show access denied page if enabled
    if (showAccessDenied) {
      return (
        <div style={{ padding: "50px", textAlign: "center" }}>
          <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
            icon={
              <LockOutlined style={{ fontSize: "72px", color: "#ff4d4f" }} />
            }
            extra={
              <Button type="primary" onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            }
          />
        </div>
      );
    }

    // Default: render nothing
    return null;
  }

  return <>{children}</>;
};

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}

/**
 * Simplified component to guard content based on a single permission
 *
 * @example
 * <PermissionGuard permission="manage_students">
 *   <StudentForm />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  fallback,
}) => {
  return (
    <RoleGuard requiredPermissions={[permission]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Simplified component for admin-only content
 *
 * @example
 * <AdminOnly>
 *   <SystemSettings />
 * </AdminOnly>
 */
export const AdminOnly: React.FC<AdminOnlyProps> = ({ children, fallback }) => {
  return (
    <RoleGuard allowedRoles={["ADMIN"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

interface ManagerOrAboveProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Simplified component for manager and admin content
 *
 * @example
 * <ManagerOrAbove>
 *   <Reports />
 * </ManagerOrAbove>
 */
export const ManagerOrAbove: React.FC<ManagerOrAboveProps> = ({
  children,
  fallback,
}) => {
  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

interface TeacherOrAboveProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Simplified component for teacher, manager and admin content
 *
 * @example
 * <TeacherOrAbove>
 *   <ClassManagement />
 * </TeacherOrAbove>
 */
export const TeacherOrAbove: React.FC<TeacherOrAboveProps> = ({
  children,
  fallback,
}) => {
  return (
    <RoleGuard
      allowedRoles={["ADMIN", "MANAGER", "TEACHER"]}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
};

export default RoleGuard;
