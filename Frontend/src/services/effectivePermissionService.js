import api from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import { normalizePermissionList } from "./permissionService";
import { fetchRolePermissionsByRoleName } from "./rolePermissionService";
import { fetchUserPermissionsByEmployeeId } from "./permissionService";
import {
  clearEffectivePermissionCache,
  getAuthenticatedUserSnapshot,
  getStoredEffectivePermissionSnapshot,
  getStoredEmployeeEmail,
  getStoredEmployeeId,
  getStoredRoleId,
  getStoredRoleName,
  getStoredToken,
  getStoredUserId,
  persistEffectivePermissions,
} from "../utils/authStorage";
import {
  isAdmin,
  isOnboardingUser,
  isPermissionManagedRole,
  isSuperAdmin,
  normalizeLoginRole,
} from "../utils/authorization";

const normalizeId = (value) => String(value ?? "").trim();

const normalizeModuleName = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const comparePermissionIds = (left, right) => {
  const leftNumber = Number(left);
  const rightNumber = Number(right);

  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
    return leftNumber - rightNumber;
  }

  return String(left ?? "").localeCompare(String(right ?? ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const getPermissionKey = (permission = {}) => {
  const moduleId = normalizeId(
    permission.moduleId ??
      permission.ModuleId ??
      permission.screenId ??
      permission.ScreenId ??
      ""
  );
  const permissionId = normalizeId(
    permission.permissionId ??
      permission.PermissionId ??
      permission.id ??
      permission.Id ??
      ""
  );
  const moduleName = normalizeModuleName(
    permission.moduleName ?? permission.ModuleName ?? ""
  );

  if (moduleId) {
    return `module:${moduleId.toLowerCase()}`;
  }

  if (permissionId) {
    return `permission:${permissionId.toLowerCase()}`;
  }

  if (moduleName) {
    return `name:${moduleName}`;
  }

  return "";
};

const isPermissionLikeRecord = (permission = {}) =>
  Boolean(
    getPermissionKey(permission) ||
      normalizeId(permission.moduleName ?? permission.ModuleName ?? "")
  );

const sortPermissions = (permissions = []) =>
  [...permissions]
    .filter(isPermissionLikeRecord)
    .sort((left, right) =>
      comparePermissionIds(
        normalizeId(left.moduleId ?? left.ModuleId ?? left.screenId ?? left.ScreenId ?? left.permissionId ?? left.PermissionId ?? left.moduleName ?? left.ModuleName ?? ""),
        normalizeId(right.moduleId ?? right.ModuleId ?? right.screenId ?? right.ScreenId ?? right.permissionId ?? right.PermissionId ?? right.moduleName ?? right.ModuleName ?? "")
      )
    );

const mergePermissionRecord = (basePermission = {}, overridePermission = {}) => {
  const merged = {
    ...basePermission,
    ...overridePermission,
  };

  const getBoolean = (fieldName, fallbackFieldName = fieldName) => {
    if (overridePermission[fieldName] !== undefined) {
      return Boolean(overridePermission[fieldName]);
    }

    if (overridePermission[fallbackFieldName] !== undefined) {
      return Boolean(overridePermission[fallbackFieldName]);
    }

    if (basePermission[fieldName] !== undefined) {
      return Boolean(basePermission[fieldName]);
    }

    if (basePermission[fallbackFieldName] !== undefined) {
      return Boolean(basePermission[fallbackFieldName]);
    }

    return false;
  };

  const canView = getBoolean("canView", "CanView");
  const canCreate = getBoolean("canCreate", "CanCreate");
  const canAdd = getBoolean("canAdd", "CanAdd") || canCreate;
  const canEdit = getBoolean("canEdit", "CanEdit");
  const canDelete = getBoolean("canDelete", "CanDelete");
  const canUpload = getBoolean("canUpload", "CanUpload");
  const canDownload = getBoolean("canDownload", "CanDownload");
  const canSubmit = getBoolean("canSubmit", "CanSubmit");
  const canApprove = getBoolean("canApprove", "CanApprove");
  const derivedAccess =
    canView ||
    canCreate ||
    canAdd ||
    canEdit ||
    canDelete ||
    canUpload ||
    canDownload ||
    canSubmit ||
    canApprove;

  return {
    ...merged,
    moduleId:
      normalizeId(overridePermission.moduleId ?? overridePermission.ModuleId ?? basePermission.moduleId ?? basePermission.ModuleId ?? "") ||
      normalizeId(overridePermission.screenId ?? overridePermission.ScreenId ?? basePermission.screenId ?? basePermission.ScreenId ?? ""),
    screenId: normalizeId(
      overridePermission.screenId ??
        overridePermission.ScreenId ??
        basePermission.screenId ??
        basePermission.ScreenId ??
        ""
    ),
    permissionId: normalizeId(
      overridePermission.permissionId ??
        overridePermission.PermissionId ??
        basePermission.permissionId ??
        basePermission.PermissionId ??
        ""
    ),
    moduleName: String(
      overridePermission.moduleName ??
        overridePermission.ModuleName ??
        basePermission.moduleName ??
        basePermission.ModuleName ??
        ""
    ).trim(),
    type: String(
      overridePermission.type ??
        overridePermission.Type ??
        basePermission.type ??
        basePermission.Type ??
        ""
    ).trim(),
    canView,
    canCreate,
    canAdd,
    canEdit,
    canDelete,
    canUpload,
    canDownload,
    canSubmit,
    canApprove,
    canAccess: Boolean(
      overridePermission.canAccess ??
        overridePermission.CanAccess ??
        basePermission.canAccess ??
        basePermission.CanAccess ??
        derivedAccess
    ),
  };
};

export const mergePermissionLists = (basePermissions = [], overridePermissions = []) => {
  const normalizedBasePermissions = normalizePermissionList(basePermissions);
  const normalizedOverridePermissions = normalizePermissionList(overridePermissions);
  const permissionMap = new Map();

  normalizedBasePermissions.forEach((permission) => {
    const key = getPermissionKey(permission);

    if (!key) {
      return;
    }

    permissionMap.set(key, { ...permission });
  });

  normalizedOverridePermissions.forEach((permission) => {
    const key = getPermissionKey(permission);

    if (!key) {
      return;
    }

    const currentPermission = permissionMap.get(key);
    permissionMap.set(
      key,
      currentPermission
        ? mergePermissionRecord(currentPermission, permission)
        : mergePermissionRecord({}, permission)
    );
  });

  return sortPermissions(Array.from(permissionMap.values()));
};

export const buildPermissionOverrideList = ({
  rolePermissions = [],
  effectivePermissions = [],
} = {}) => {
  const normalizedRolePermissions = normalizePermissionList(rolePermissions);
  const normalizedEffectivePermissions = normalizePermissionList(effectivePermissions);
  const rolePermissionMap = new Map();
  const overridePermissions = [];

  normalizedRolePermissions.forEach((permission) => {
    const key = getPermissionKey(permission);

    if (!key) {
      return;
    }

    rolePermissionMap.set(key, permission);
  });

  normalizedEffectivePermissions.forEach((permission) => {
    const key = getPermissionKey(permission);

    if (!key) {
      return;
    }

    const rolePermission = rolePermissionMap.get(key);

    if (!rolePermission) {
      overridePermissions.push(permission);
      return;
    }

    const fields = [
      "moduleId",
      "screenId",
      "permissionId",
      "moduleName",
      "type",
      "canView",
      "canCreate",
      "canAdd",
      "canEdit",
      "canDelete",
      "canUpload",
      "canDownload",
      "canSubmit",
      "canApprove",
      "canAccess",
    ];

    const hasDifference = fields.some((field) => {
      const leftValue = permission[field];
      const rightValue = rolePermission[field];

      if (typeof leftValue === "boolean" || typeof rightValue === "boolean") {
        return Boolean(leftValue) !== Boolean(rightValue);
      }

      return String(leftValue ?? "").trim() !== String(rightValue ?? "").trim();
    });

    if (hasDifference) {
      overridePermissions.push(permission);
    }
  });

  return sortPermissions(overridePermissions);
};

const buildCurrentUserSnapshot = ({
  rolePermissions = [],
  userPermissions = [],
  effectivePermissions = [],
  currentUser = {},
  source = "",
} = {}) => {
  const mergedPermissions =
    effectivePermissions.length > 0
      ? sortPermissions(effectivePermissions)
      : mergePermissionLists(rolePermissions, userPermissions);

  return persistEffectivePermissions({
    userId:
      normalizeId(
        currentUser.userId ||
          currentUser.employeeId ||
          currentUser.id ||
          getStoredUserId() ||
          getStoredEmployeeId() ||
          ""
      ),
    userEmail: String(
      currentUser.userEmail ||
        currentUser.employeeEmail ||
        currentUser.email ||
        getStoredEmployeeEmail() ||
        ""
    ).trim(),
    roleId: normalizeId(
      currentUser.roleId || getStoredRoleId() || ""
    ),
    roleName: String(
      currentUser.roleName ||
        currentUser.role ||
        getStoredRoleName() ||
        ""
    ).trim(),
    modules: mergedPermissions,
    permissions: mergedPermissions,
    source,
    rolePermissions: sortPermissions(rolePermissions),
    userPermissions: sortPermissions(userPermissions),
  });
};

const tryCurrentUserPermissionEndpoint = async (currentUser = {}) => {
  const endpoint = API_ENDPOINTS?.permission?.get;

  if (!endpoint) {
    return null;
  }

  try {
    const response = await api.get(endpoint, {
      headers: {
        Accept: "application/json",
      },
      skipAuthFailureHandling: true,
    });

    const normalizedEffectivePermissions = normalizePermissionList(response.data);

    if (normalizedEffectivePermissions.length === 0) {
      return null;
    }

    console.log("[Permissions] Current-user endpoint succeeded:", {
      endpoint,
      permissionCount: normalizedEffectivePermissions.length,
    });

    return buildCurrentUserSnapshot({
      effectivePermissions: normalizedEffectivePermissions,
      currentUser,
      source: "current-user-endpoint",
    });
  } catch (error) {
    const status = Number(error?.response?.status || 0);

    if (status && ![401, 403, 404, 405, 500].includes(status)) {
      throw error;
    }

    return null;
  }
};

const tryFallbackPermissionMerge = async (currentUser = {}) => {
  const roleName =
    String(
      currentUser.roleName ||
        currentUser.role ||
        getStoredRoleName() ||
        ""
    ).trim();
  const roleCandidates = Array.from(
    new Set(
      [
        currentUser.roleId,
        currentUser.roleName,
        currentUser.role,
        getStoredRoleId(),
        getStoredRoleName(),
      ]
        .map((value) => normalizeId(value))
        .filter(Boolean)
    )
  );
  const userCandidates = Array.from(
    new Set(
      [
        currentUser.userId,
        currentUser.employeeId,
        currentUser.id,
        getStoredUserId(),
        getStoredEmployeeId(),
      ]
        .map((value) => normalizeId(value))
        .filter(Boolean)
    )
  );

  console.log("[Permissions] Current user snapshot:", {
    userId: userCandidates[0] || "",
    roleId: roleCandidates[0] || "",
    roleName,
  });

  let rolePermissions = [];
  let userPermissions = [];

  for (const candidate of roleCandidates.length > 0 ? roleCandidates : [roleName]) {
    if (!candidate) {
      continue;
    }

    try {
      const snapshot = await fetchRolePermissionsByRoleName(candidate);
      rolePermissions = Array.isArray(snapshot?.permissions) ? snapshot.permissions : [];
      if (rolePermissions.length > 0 || !roleName) {
        break;
      }
    } catch (error) {
      const status = Number(error?.response?.status || 0);

      if (status && ![400, 401, 403, 404].includes(status)) {
        throw error;
      }
    }
  }

  for (const candidate of userCandidates) {
    try {
      const snapshot = await fetchUserPermissionsByEmployeeId(candidate);
      userPermissions = Array.isArray(snapshot?.permissions) ? snapshot.permissions : [];

      if (userPermissions.length > 0 || !candidate) {
        break;
      }
    } catch (error) {
      const status = Number(error?.response?.status || 0);

      if (status && ![400, 401, 403, 404].includes(status)) {
        throw error;
      }
    }
  }

  const effectivePermissions = mergePermissionLists(rolePermissions, userPermissions);

  console.log("[Permissions] Role permissions count:", rolePermissions.length);
  console.log("[Permissions] User override permissions count:", userPermissions.length);
  console.log("[Permissions] Effective permissions count:", effectivePermissions.length);

  return buildCurrentUserSnapshot({
    rolePermissions,
    userPermissions,
    effectivePermissions,
    currentUser,
    source: "role-user-merge",
  });
};

export const fetchCurrentUserEffectivePermissions = async ({
  force = false,
  currentUser = {},
} = {}) => {
  const authSnapshot = getAuthenticatedUserSnapshot();
  const resolvedCurrentUser = {
    ...authSnapshot,
    ...currentUser,
    userId:
      currentUser.userId ||
      currentUser.employeeId ||
      authSnapshot.userId ||
      authSnapshot.employeeId ||
      getStoredUserId() ||
      getStoredEmployeeId() ||
      "",
    roleId:
      currentUser.roleId ||
      authSnapshot.roleId ||
      getStoredRoleId() ||
      "",
    roleName:
      currentUser.roleName ||
      authSnapshot.roleName ||
      getStoredRoleName() ||
      authSnapshot.role ||
      "",
    role:
      currentUser.role ||
      authSnapshot.role ||
      getStoredRoleName() ||
      "",
  };

  if (!resolvedCurrentUser.token && !getStoredToken()) {
    clearEffectivePermissionCache();
    return persistEffectivePermissions({
      userId: "",
      userEmail: "",
      roleId: "",
      roleName: "",
      modules: [],
    });
  }

  const cachedSnapshot = getStoredEffectivePermissionSnapshot();

  if (
    !force &&
    cachedSnapshot &&
    normalizeId(cachedSnapshot.userId || "") === normalizeId(resolvedCurrentUser.userId || "") &&
    normalizeId(cachedSnapshot.roleId || "") === normalizeId(resolvedCurrentUser.roleId || "") &&
    String(cachedSnapshot.roleName || "").trim().toLowerCase() ===
      String(resolvedCurrentUser.roleName || resolvedCurrentUser.role || "").trim().toLowerCase() &&
    Array.isArray(cachedSnapshot.modules) &&
    cachedSnapshot.modules.length > 0
  ) {
    return cachedSnapshot;
  }

  const normalizedRole = normalizeLoginRole(
    resolvedCurrentUser.role ||
      resolvedCurrentUser.roleName ||
      getStoredRoleName() ||
      "",
    "user"
  );

  if (isSuperAdmin(normalizedRole)) {
    return buildCurrentUserSnapshot({
      effectivePermissions: [
        {
          moduleId: "all",
          moduleName: "all",
          canAccess: true,
          canView: true,
          canCreate: true,
          canAdd: true,
          canEdit: true,
          canDelete: true,
          canUpload: true,
          canDownload: true,
          canSubmit: true,
          canApprove: true,
        },
      ],
      currentUser: resolvedCurrentUser,
      source: "superadmin-bypass",
    });
  }

  if (isAdmin(normalizedRole) || isOnboardingUser()) {
    clearEffectivePermissionCache();
    return persistEffectivePermissions({
      userId: normalizeId(resolvedCurrentUser.userId || ""),
      userEmail: String(resolvedCurrentUser.email || resolvedCurrentUser.userEmail || "").trim(),
      roleId: normalizeId(resolvedCurrentUser.roleId || ""),
      roleName: String(resolvedCurrentUser.roleName || resolvedCurrentUser.role || "").trim(),
      modules: [],
    });
  }

  if (!isPermissionManagedRole(normalizedRole) && !resolvedCurrentUser.roleName && !resolvedCurrentUser.roleId) {
    clearEffectivePermissionCache();
    return persistEffectivePermissions({
      userId: normalizeId(resolvedCurrentUser.userId || ""),
      userEmail: String(resolvedCurrentUser.email || resolvedCurrentUser.userEmail || "").trim(),
      roleId: normalizeId(resolvedCurrentUser.roleId || ""),
      roleName: String(resolvedCurrentUser.roleName || resolvedCurrentUser.role || "").trim(),
      modules: [],
    });
  }

  const currentUserSnapshot = await tryCurrentUserPermissionEndpoint(resolvedCurrentUser);

  if (currentUserSnapshot) {
    return currentUserSnapshot;
  }

  return tryFallbackPermissionMerge(resolvedCurrentUser);
};

export const clearCurrentUserEffectivePermissions = clearEffectivePermissionCache;
