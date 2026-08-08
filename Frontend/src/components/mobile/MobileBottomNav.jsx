import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  CheckSquare,
  FileText,
  Menu,
} from "lucide-react";
import { getDashboardPathForRole, getUserRole } from "../../utils/authorization";
import { usePermissionScope } from "../../context/usePermissionScope";
import "./MobileBottomNav.css";

const baseNavItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    moduleNames: ["Dashboard"],
  },
  {
    label: "Attendance",
    path: "/attendance",
    icon: CalendarCheck,
    moduleNames: ["Attendance"],
  },
  {
    label: "Tasks",
    path: "/task-management",
    icon: CheckSquare,
    moduleNames: ["Task Management", "Tasks"],
  },
  {
    label: "Leaves",
    path: "/leave-management",
    icon: FileText,
    moduleNames: ["Leave Management", "Leaves"],
  },
];

export default function MobileBottomNav({ onToggleSidebar, sidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { canAccessModule } = usePermissionScope();
  const dashboardPath = getDashboardPathForRole(getUserRole());
  const navItems = baseNavItems
    .map((item) => {
      const path = item.label === "Dashboard" ? dashboardPath : item.path;
      const isAllowed =
        Array.isArray(item.moduleNames) &&
        item.moduleNames.some((moduleName) => canAccessModule(moduleName));

      return {
        ...item,
        path,
        isAllowed,
      };
    })
    .filter((item) => item.isAllowed);

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === dashboardPath
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              className={`mobile-nav-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
              type="button"
            >
              <div className="mobile-nav-icon-wrapper">
                <Icon size={20} className="mobile-nav-icon" />
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          className={`mobile-nav-item ${sidebarOpen ? "active" : ""}`}
          onClick={onToggleSidebar}
        >
          <div className="mobile-nav-icon-wrapper">
            <Menu size={20} className="mobile-nav-icon" />
          </div>
          <span className="mobile-nav-label">Menu</span>
        </button>
      </div>
    </nav>
  );
}
