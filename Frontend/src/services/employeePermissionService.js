import {
  clearCurrentUserEffectivePermissions,
  fetchCurrentUserEffectivePermissions,
} from "./effectivePermissionService";
import { getStoredEmployeeEmail, getStoredEmployeeId } from "../utils/authStorage";

const getFriendlyEmployeePermissionErrorMessage = (
  error,
  fallback = "We could not load employee permissions right now."
) => {
  const status = error?.response?.status;
  const validationErrors = error?.response?.data?.errors;

  if (status === 401) {
    return "Your session has expired or you are no longer authorized. Please sign in again.";
  }

  if (status === 403) {
    return "You do not have permission to access this resource.";
  }

  if (validationErrors && typeof validationErrors === "object") {
    const messages = Object.values(validationErrors)
      .flat()
      .filter(Boolean)
      .map((message) => String(message).trim())
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.title ||
    error?.message ||
    fallback
  );
};

const isAuthFailure = (error) =>
  error?.response?.status === 401 ||
  error?.name === "CanceledError" ||
  error?.code === "ERR_CANCELED" ||
  /session\s+expired|sign\s*in|token\s+expired|expired\s+token/i.test(
    String(error?.message || "")
  );

export const clearEmployeePermissionCache = () => {
  clearCurrentUserEffectivePermissions();

  if (typeof window === "undefined") {
    return;
  }

  const storages = [window.localStorage, window.sessionStorage].filter(Boolean);

  storages.forEach((storage) => {
    [
      "employeePermissions",
      "employeeAllowedModules",
      "employeeModules",
      "employeePermissionModules",
      "userId",
      "userEmail",
      "employeeId",
      "employeeEmail",
    ].forEach((key) => {
      storage.removeItem(key);
    });
  });
};

export const fetchAllowedEmployeeModules = async ({
  force = false,
  userId = "",
  userEmail = "",
  role = "",
} = {}) => {
  const snapshot = await fetchCurrentUserEffectivePermissions({
    force,
    currentUser: {
      userId: userId || getStoredEmployeeId() || "",
      employeeId: userId || getStoredEmployeeId() || "",
      userEmail: userEmail || getStoredEmployeeEmail() || "",
      roleName: role,
      role,
    },
  });

  console.log("[Permissions] Selected Permission Flow:", "effective-user-permissions");
  console.log("[Permissions] Effective permissions count:", snapshot?.modules?.length || 0);

  return snapshot.modules || [];
};

export const getEmployeePermissionErrorMessage =
  getFriendlyEmployeePermissionErrorMessage;

export const isEmployeePermissionAuthFailure = isAuthFailure;

export { clearEmployeePermissionCache as clearEmployeePermissions };
