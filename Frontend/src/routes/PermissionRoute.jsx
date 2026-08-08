import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { PageSkeleton } from "../components/Skeletons";
import { usePermissionScope } from "../context/usePermissionScope";
import { isSuperAdmin } from "../utils/authorization";

const PermissionRoute = ({ children, module }) => {
  const location = useLocation();
  const { loadingPermissions, canAccessModule, errorStatus, role } = usePermissionScope();
  const requestedModule = String(module ?? "").trim();
  const hasPermission = requestedModule ? canAccessModule(requestedModule) : true;
  const isSuperAdminUser = isSuperAdmin(role) || isSuperAdmin();

  console.log("Current Route:", location.pathname);
  console.log("Permission Check:", hasPermission);

  if (isSuperAdminUser) {
    return children;
  }

  if (loadingPermissions) {
    return (
      <div className="app-route-skeleton" style={{ padding: "24px" }}>
        <PageSkeleton variant="dashboard" />
      </div>
    );
  }

  if (errorStatus === 403) {
    return <Navigate to="/403" replace />;
  }

  if (!requestedModule) {
    return children;
  }

  return hasPermission ? children : <Navigate to="/403" replace />;
};

export default PermissionRoute;
