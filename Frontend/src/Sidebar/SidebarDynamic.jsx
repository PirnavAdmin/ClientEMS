import React, { useMemo, useRef, useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaList,
  FaChevronDown,
  FaBuilding,
  FaCalendarAlt,
  FaShieldAlt,
  FaLaptop,
  FaCalendarMinus,
  FaBell,
  FaFileSignature,
  FaChartBar,
  FaMoneyBillWave,
  FaProjectDiagram,
  FaUserTie,
  FaCog,
  FaTicketAlt,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaExclamationCircle,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { usePermissionScope } from "../context/usePermissionScope";
import {
  hasEmployeeIdClaim,
  getDashboardPathForRole,
  getUserRole,
  isEmployeeOnlyModule,
  modulePermissionMatches,
  isSuperAdmin,
} from "../utils/authorization";
import { ticketPermissionMatches } from "../TicketManagement/ticketConfig";
import honeyIcon from "../assets/honeyicon.png";
import "./Sidebar.css";

const SIDEBAR_NAVIGATION = [
  {
    kind: "link",
    key: "dashboard",
    label: "Dashboard",
    icon: FaTachometerAlt,
    moduleNames: ["Dashboard"],
    getTo: (roleName) => getDashboardPathForRole(roleName),
  },
  {
    kind: "group",
    key: "employees",
    label: "Employees",
    icon: FaUsers,
    items: [
      {
        to: "/employees",
        icon: FaList,
        label: "Employee List",
        moduleNames: ["Employees", "Employee List"],
      },
      {
        to: "/admin/onboarding",
        icon: FaUserTie,
        label: "Onboarding List",
        moduleNames: ["Onboarding List", "Onboarding"],
      },
      {
        to: "/add-employee",
        icon: FaUsers,
        label: "Add Details",
        moduleNames: ["Add Employee", "Add Details"],
      },
    ],
  },
  {
    kind: "group",
    key: "company",
    label: "Company",
    icon: FaBuilding,
    items: [
      {
        to: "/company",
        icon: FaBuilding,
        label: "Company Details",
        moduleNames: ["Company Details", "Company"],
      },
      {
        to: "/projects",
        icon: FaList,
        label: "Projects",
        moduleNames: ["Projects"],
      },
      {
        to: "/holidays",
        icon: FaCalendarAlt,
        label: "Holidays",
        moduleNames: ["Holidays"],
      },
    ],
  },
  {
    kind: "group",
    key: "administration",
    label: "Administration",
    icon: FaShieldAlt,
    items: [
      {
        to: "/super-admin/administration/admins",
        icon: FaUsers,
        label: "Admin Management",
        moduleNames: ["Admin Management", "Admins"],
      },
      {
        to: "/super-admin/administration/subscriptions",
        icon: FaCreditCard,
        label: "Subscription Management",
        moduleNames: ["Subscription Management", "Subscriptions"],
      },
      {
        to: "/super-admin/administration/permissions",
        icon: FaShieldAlt,
        label: "Permissions",
        moduleNames: ["Permissions", "Super Admin Permissions"],
      },
    ],
  },
  {
    kind: "group",
    key: "masters",
    label: "Masters",
    icon: FaShieldAlt,
    items: [
      {
        to: "/roles",
        icon: FaShieldAlt,
        label: "Roles",
        moduleNames: ["Roles"],
      },
      {
        to: "/assets",
        icon: FaLaptop,
        label: "Assets",
        moduleNames: ["Assets"],
      },
      {
        to: "/clients",
        icon: FaUserTie,
        label: "Clients",
        moduleNames: ["Clients"],
      },
      {
        to: "/departments",
        icon: FaBuilding,
        label: "Departments",
        moduleNames: ["Departments"],
      },
    ],
  },
  {
    kind: "group",
    key: "tickets",
    label: "Ticket Management",
    icon: FaTicketAlt,
    singleChildAsLink: true,
    items: [
      {
        to: "/admin/tickets",
        icon: FaList,
        label: "All Tickets",
        moduleNames: ["All Tickets"],
      },
      {
        to: "/employee/my-tickets",
        icon: FaList,
        label: "My Tickets",
        moduleNames: ["My Tickets"],
      },
    ],
  },
  {
    kind: "link",
    key: "payroll",
    label: "Payroll",
    icon: FaMoneyBillWave,
    to: "/payroll",
    moduleNames: ["Payroll"],
  },
  {
    kind: "link",
    key: "user-payslip",
    label: "Payslip",
    icon: FaMoneyBillWave,
    to: "/user-payslip",
    moduleNames: ["User Payslip"],
  },
  {
    kind: "link",
    key: "reports",
    label: "Reports",
    icon: FaChartBar,
    to: "/reports",
    moduleNames: ["Reports"],
  },
  {
    kind: "link",
    key: "offer-letters",
    label: "Offer Letters",
    icon: FaFileSignature,
    to: "/offer-letters",
    moduleNames: ["Offer Letters"],
  },
  {
    kind: "link",
    key: "attendance",
    label: "Attendance",
    icon: FaCalendarAlt,
    to: "/attendance",
    moduleNames: ["Attendance"],
  },
  {
    kind: "link",
    key: "user-attendance",
    label: "My Attendance",
    icon: FaCalendarAlt,
    to: "/user-attendance",
    moduleNames: ["User Attendance"],
  },
  {
    kind: "link",
    key: "teams",
    label: "Teams",
    icon: FaProjectDiagram,
    to: "/teams",
    moduleNames: ["Teams"],
  },
  {
    kind: "link",
    key: "leave-management",
    label: "Leave",
    icon: FaCalendarMinus,
    to: "/leave-management",
    moduleNames: ["Leave Management"],
  },
  {
    kind: "link",
    key: "user-leave-management",
    label: "Employee Leave",
    icon: FaCalendarMinus,
    to: "/user-leave-management",
    moduleNames: ["User Leave Management"],
  },
  {
    kind: "link",
    key: "notifications",
    label: "Notifications",
    icon: FaBell,
    to: "/notifications",
    moduleNames: ["Notifications"],
  },
  {
    kind: "link",
    key: "user-notifications",
    label: "My Notifications",
    icon: FaBell,
    to: "/user-notifications",
    moduleNames: ["User Notifications"],
  },
  {
    kind: "group",
    key: "settings",
    label: "Settings",
    icon: FaCog,
    items: [
      {
        to: "/settings",
        icon: FaCog,
        label: "General Settings",
        moduleNames: ["Settings", "General Settings"],
      },
      {
        to: "/settings/appraisal",
        icon: FaChartBar,
        label: "Appraisal",
        moduleNames: ["Appraisal"],
      },
      {
        to: "/settings/employee-goals",
        icon: FaList,
        label: "Employee Goals",
        moduleNames: ["Employee Goals"],
      },
      {
        to: "/settings/goal-review",
        icon: FaChartBar,
        label: "Goal Review",
        moduleNames: ["Goal Review"],
      },
      {
        to: "/settings/performance-cycle",
        icon: FaCalendarAlt,
        label: "Performance Cycle",
        moduleNames: ["Performance Cycle"],
      },
      {
        to: "/settings/resignation",
        icon: FaFileSignature,
        label: "Resignation",
        moduleNames: ["Resignation"],
      },
      {
        to: "/settings/employee-clearance",
        icon: FaShieldAlt,
        label: "Employee Clearance",
        moduleNames: ["Employee Clearance"],
      },
      {
        to: "/settings/exit-interview",
        icon: FaUserTie,
        label: "Exit Interview",
        moduleNames: ["Exit Interview"],
      },
      {
        to: "/settings/full-final-settlement",
        icon: FaMoneyBillWave,
        label: "Full Final Settlement",
        moduleNames: ["Full Final Settlement"],
      },
      {
        to: "/settings/shift",
        icon: FaCalendarAlt,
        label: "Shift Settings",
        moduleNames: ["Shift Settings"],
      },
      {
        to: "/settings/tax-management",
        icon: FaFileInvoiceDollar,
        label: "Tax Management",
        moduleNames: ["Tax Management"],
      },
      {
        to: "/settings/templates",
        icon: FaFileSignature,
        label: "Templates",
        moduleNames: ["Templates"],
      },
      {
        to: "/settings/workflow",
        icon: FaProjectDiagram,
        label: "Workflow",
        moduleNames: ["Workflow"],
      },
    ],
  },
];

const SUPER_ADMIN_ROUTE_ALIASES = {
  "/super-admin/administration/admins": "/admin-management",
  "/super-admin/administration/subscriptions": "/subscription-management",
  "/super-admin/administration/permissions": "/permissions",
};

const SUPER_ADMIN_ALLOWED_TOP_LEVEL_KEYS = new Set([
  "dashboard",
  "administration",
]);

const SUPER_ADMIN_ALLOWED_ADMIN_LABELS = new Set([
  "Admin Management",
  "Subscription Management",
  "Permissions",
  "Screen Permissions",
]);

const normalizePath = (path) => String(path ?? "").trim();

const normalizeMenuName = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const matchesPath = (pathname, path) => {
  const normalizedPath = normalizePath(path);

  if (!normalizedPath) {
    return false;
  }

  if (pathname === normalizedPath) {
    return true;
  }

  return normalizedPath === "/add-employee" && pathname.startsWith("/add-employee/");
};

const getItemModuleNames = (item) => {
  if (!item) {
    return [];
  }

  if (Array.isArray(item.moduleNames)) {
    return item.moduleNames;
  }

  if (item.moduleName) {
    return [item.moduleName];
  }

  return [];
};

const isEmployeeOnlyNavigationItem = (item) =>
  getItemModuleNames(item).some((moduleName) => isEmployeeOnlyModule(moduleName));

const matchesAllowedModule = (permission, moduleName) => {
  const permissionName = String(
    permission?.moduleName ?? permission?.ModuleName ?? ""
  ).trim();
  const requestedModule = String(moduleName ?? "").trim();

  if (!permissionName || !requestedModule) {
    return false;
  }

  return (
    modulePermissionMatches(permissionName, requestedModule) ||
    ticketPermissionMatches(permissionName, requestedModule) ||
    modulePermissionMatches(
      normalizeMenuName(permissionName),
      normalizeMenuName(requestedModule)
    )
  );
};

const isItemAllowedByPermissions = (item, allowedModules) => {
  const moduleNames = getItemModuleNames(item);

  if (moduleNames.length === 0) {
    return true;
  }

  if (!Array.isArray(allowedModules) || allowedModules.length === 0) {
    return false;
  }

  return allowedModules.some(
    (permission) =>
      permission?.canAccess === true &&
      moduleNames.some((moduleName) => matchesAllowedModule(permission, moduleName))
  );
};

const resolveItemPath = (item, roleName) => {
  if (!item) {
    return "";
  }

  const superAdminRole = isSuperAdmin(roleName);

  if (typeof item.getTo === "function") {
    const resolvedPath = normalizePath(item.getTo(roleName));

    return superAdminRole
      ? SUPER_ADMIN_ROUTE_ALIASES[resolvedPath] || resolvedPath
      : resolvedPath;
  }

  const resolvedPath = normalizePath(item.to);

  return superAdminRole
    ? SUPER_ADMIN_ROUTE_ALIASES[resolvedPath] || resolvedPath
    : resolvedPath;
};

const buildNavigationModel = (roleName, allowedModules, hasEmployeeId) => {
  const superAdminRole = isSuperAdmin(roleName);

  return SIDEBAR_NAVIGATION.reduce((acc, item) => {
    if (item.kind === "link") {
      const path = resolveItemPath(item, roleName);

      if (
        !path ||
        (!hasEmployeeId && isEmployeeOnlyNavigationItem(item)) ||
        (superAdminRole &&
          !SUPER_ADMIN_ALLOWED_TOP_LEVEL_KEYS.has(item.key)) ||
        (!superAdminRole && !isItemAllowedByPermissions(item, allowedModules))
      ) {
        return acc;
      }

      acc.push({
        ...item,
        path,
      });

      return acc;
    }

    if (superAdminRole && item.key !== "administration") {
      return acc;
    }

    const visibleItems = item.items
      .filter((child) => {
        if (!hasEmployeeId && isEmployeeOnlyNavigationItem(child)) {
          return false;
        }

        return superAdminRole
          ? SUPER_ADMIN_ALLOWED_ADMIN_LABELS.has(child.label)
          : true;
      })
      .map((child) => ({
        ...child,
        path: resolveItemPath(child, roleName),
        label:
          superAdminRole && child.label === "Permissions"
            ? "Screen Permissions"
            : child.label,
      }))
      .filter(
        (child) =>
          child.path &&
          (superAdminRole || isItemAllowedByPermissions(child, allowedModules))
      );

    if (visibleItems.length === 0) {
      return acc;
    }

    if (item.singleChildAsLink && visibleItems.length === 1) {
      acc.push({
        kind: "link",
        key: `${item.key}:${visibleItems[0].key || visibleItems[0].path}`,
        label: visibleItems[0].label,
        icon: item.icon,
        path: visibleItems[0].path,
        moduleNames: visibleItems[0].moduleNames,
      });
      return acc;
    }

    acc.push({
      ...item,
      paths: visibleItems.map((visibleItem) => visibleItem.path),
      visibleItems,
    });

    return acc;
  }, []);
};

const getMenuKeyFromPath = (pathname, navigation) =>
  navigation.find(
    (item) =>
      item.kind === "group" &&
      Array.isArray(item.paths) &&
      item.paths.some((path) => matchesPath(pathname, path))
  )?.key || null;

const getLinkClassName = ({ isActive }) =>
  `menu-item ${isActive ? "active" : ""}`;

const getSubmenuLinkClassName = ({ isActive }) =>
  `submenu-item ${isActive ? "active" : ""}`;

function SidebarLink({ to, icon, label, compact, onClick }) {
  return (
    <NavLink
      to={to}
      className={getLinkClassName}
      onClick={onClick}
      data-title={label}
      data-nav-target={to}
      title={compact ? label : undefined}
    >
      <span className="menu-item-icon">{React.createElement(icon)}</span>
      <span className="menu-item-label">{label}</span>
    </NavLink>
  );
}

function SubmenuLink({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      className={getSubmenuLinkClassName}
      onClick={onClick}
      data-title={label}
      data-nav-target={to}
    >
      <span className="submenu-item-icon">{React.createElement(icon)}</span>
      <span className="submenu-item-label">{label}</span>
    </NavLink>
  );
}

function Sidebar({ collapsed = false, isMobile = false, mobileOpen = false, onClose }) {
  const location = useLocation();
  const roleName = getUserRole();
  const hasEmployeeId = hasEmployeeIdClaim();
  const { isLoading, error, refreshPermissions, allowedModules } = usePermissionScope();
  const isCompact = !isMobile && collapsed;
  const dashboardPath = getDashboardPathForRole(roleName);
  const navigation = useMemo(
    () => buildNavigationModel(roleName, allowedModules, hasEmployeeId),
    [allowedModules, hasEmployeeId, roleName]
  );
  const routeMenu = useMemo(
    () => getMenuKeyFromPath(location.pathname, navigation),
    [location.pathname, navigation]
  );
  const [expandedMenu, setExpandedMenu] = useState(routeMenu);
  const [submenuDirections, setSubmenuDirections] = useState({});
  const menuButtonRefs = useRef({});
  const submenuRefs = useRef({});

  const setMenuButtonRef = (menuKey) => (node) => {
    if (node) {
      menuButtonRefs.current[menuKey] = node;
      return;
    }

    delete menuButtonRefs.current[menuKey];
  };

  const setSubmenuRef = (menuKey) => (node) => {
    if (node) {
      submenuRefs.current[menuKey] = node;
      return;
    }

    delete submenuRefs.current[menuKey];
  };

  const measureSubmenuDirection = (menuKey) => {
    if (typeof window === "undefined") {
      return "down";
    }

    const button = menuButtonRefs.current[menuKey];
    const submenu = submenuRefs.current[menuKey];

    if (!button || !submenu) {
      return "down";
    }

    const rect = button.getBoundingClientRect();
    const submenuHeight = submenu.scrollHeight || submenu.offsetHeight || 0;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const buffer = 16;

    if (spaceBelow >= submenuHeight + buffer) {
      return "down";
    }

    if (spaceAbove >= submenuHeight + buffer) {
      return "up";
    }

    return spaceAbove > spaceBelow ? "up" : "down";
  };

  const syncSubmenuDirection = (menuKey) => {
    const nextDirection = measureSubmenuDirection(menuKey);

    setSubmenuDirections((prev) => ({
      ...prev,
      [menuKey]: nextDirection,
    }));

    return nextDirection;
  };

  const toggleMenu = (menuKey) => {
    if (expandedMenu === menuKey) {
      setExpandedMenu(null);
      return;
    }

    syncSubmenuDirection(menuKey);
    setExpandedMenu(menuKey);
  };

  const closeMenus = () => {
    setExpandedMenu(null);
  };

  const handleLinkClick = () => {
    closeMenus();

    if (isMobile) {
      onClose?.();
    }
  };

  const isMenuExpanded = (menuKey) => expandedMenu === menuKey;
  const isMenuActive = (menuKey) =>
    routeMenu === menuKey || isMenuExpanded(menuKey);

  const renderNavigationItem = (item) => {
    if (item.kind === "link") {
      return (
        <SidebarLink
          key={item.key}
          to={item.path}
          icon={item.icon}
          label={item.label}
          compact={isCompact}
          onClick={handleLinkClick}
        />
      );
    }

    const submenuDirection = submenuDirections[item.key] || "down";

    return (
      <div
        className={`menu-section ${submenuDirection === "up" ? "submenu-open-up" : "submenu-open-down"}`}
        key={item.key}
      >
        <button
          type="button"
          className={`menu-item menu-toggle ${isMenuActive(item.key) ? "active" : ""}`}
          ref={setMenuButtonRef(item.key)}
          onClick={() => toggleMenu(item.key)}
          data-title={item.label}
          aria-expanded={isMenuExpanded(item.key)}
          title={isCompact ? item.label : undefined}
        >
          <span className="menu-item-icon">{React.createElement(item.icon)}</span>
          <span className="menu-item-label">{item.label}</span>
          <span className="menu-arrow-wrap">
            <FaChevronDown className={`menu-arrow ${isMenuExpanded(item.key) ? "rotated" : ""}`} />
          </span>
        </button>

        {!isCompact && (
          <div
            ref={setSubmenuRef(item.key)}
            className={`submenu-shell ${isMenuExpanded(item.key) ? "open" : ""}`}
          >
            <div className="submenu">
              {item.visibleItems.map((child) => (
                <SubmenuLink
                  key={child.key || child.path}
                  to={child.path}
                  icon={child.icon}
                  label={child.label}
                  onClick={handleLinkClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLoadingState = () => (
    <div className="sidebar-status-panel" aria-busy="true" aria-live="polite">
      <div className="sidebar-status-copy">
        <span className="sidebar-status-icon">
          <FaExclamationCircle />
        </span>
        <div>
          <div className="sidebar-status-title">Loading permissions</div>
          <div className="sidebar-status-text">Please wait while your allowed modules are fetched.</div>
        </div>
      </div>
      <div className="sidebar-skeleton-list">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`sidebar-skeleton-item ${index === 0 ? "is-large" : ""}`}
          />
        ))}
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="sidebar-status-panel sidebar-status-error">
      <div className="sidebar-status-copy">
        <span className="sidebar-status-icon">
          <FaExclamationCircle />
        </span>
        <div>
          <div className="sidebar-status-title">Permissions unavailable</div>
          <div className="sidebar-status-text">{error || "We could not load your allowed modules right now."}</div>
        </div>
      </div>
      <button
        type="button"
        className="sidebar-status-retry"
        onClick={() => {
          void refreshPermissions({ force: true }).catch(() => {});
        }}
      >
        Retry
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="sidebar-status-panel">
      <div className="sidebar-status-copy">
        <span className="sidebar-status-icon">
          <FaExclamationCircle />
        </span>
        <div>
          <div className="sidebar-status-title">No modules assigned</div>
          <div className="sidebar-status-text">Your account does not currently have any sidebar modules.</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && (
        <button
          type="button"
          className={`sidebar-backdrop ${mobileOpen ? "open" : ""}`}
          onClick={() => onClose?.()}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`sidebar ${isCompact ? "collapsed" : ""} ${isMobile ? "mobile-sidebar" : ""} ${
          isMobile && mobileOpen ? "mobile-open" : ""
        }`}
      >
        <NavLink
          to={dashboardPath}
          className="logo sidebar-brand"
          aria-label="Go to dashboard"
          onClick={handleLinkClick}
        >
        <span className="sidebar-brand-icon-wrap" aria-hidden="true">
          <img src={honeyIcon} alt="" className="sidebar-brand-icon" />
        </span>
        <span className="sidebar-brand-text">Honeywell</span>
        </NavLink>

        <nav className="menu">
          {isLoading ? (
            renderLoadingState()
          ) : error && navigation.length === 0 ? (
            renderErrorState()
          ) : navigation.length === 0 ? (
            renderEmptyState()
          ) : (
            navigation.map(renderNavigationItem)
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
