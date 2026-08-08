import React, { useEffect, useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { API_ENDPOINTS } from "../../api/endpoints";
import { useAdminPermissions } from "../../context/AdminPermissionContext";
import { useEmployeePermissions } from "../../context/EmployeePermissionContext";
import {
  createSuperAdminPermissionSnapshot,
  isAdminPermissionAuthFailure,
} from "../../services/adminPermissionService";
import { isEmployeePermissionAuthFailure } from "../../services/employeePermissionService";
import {
  clearAuthData,
  decodeJwtPayload,
  extractAdminId,
  extractAuthenticatedUser,
  extractEmail,
  extractEmployeeId,
  extractOnboardingId,
  extractRole,
  extractUserId,
  getAuthStorage,
  normalizeAuthToken,
  persistAdminPermissions,
} from "../../utils/authStorage";
import { getDashboardPathForRole } from "../../utils/authorization";
import { startSessionTimer } from "../../utils/sessionManager";
import AuthField from "./AuthField";
import { isValidEmail } from "./authUtils";

const tryParseJson = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const normalizeLoginObject = (value) => {
  const parsedValue = tryParseJson(value);

  if (
    parsedValue &&
    typeof parsedValue === "object" &&
    !Array.isArray(parsedValue)
  ) {
    return parsedValue;
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  return null;
};

const extractLoginPayload = (response) =>
  normalizeLoginObject(response?.data) || normalizeLoginObject(response) || {};

const findDeepValue = (source, keys, visited = new Set(), depth = 0) => {
  if (
    !source ||
    typeof source !== "object" ||
    Array.isArray(source) ||
    visited.has(source) ||
    depth > 4
  ) {
    return "";
  }

  visited.add(source);

  for (const key of keys) {
    const value = source[key];
    const normalizedValue = String(value ?? "").trim();

    if (normalizedValue) {
      return normalizedValue;
    }
  }

  for (const value of Object.values(source)) {
    if (value && typeof value === "object") {
      const nestedValue = findDeepValue(value, keys, visited, depth + 1);

      if (nestedValue) {
        return nestedValue;
      }
    }
  }

  return "";
};

const extractLoginToken = (response) =>
  findDeepValue(response, [
    "token",
    "accessToken",
    "jwtToken",
    "authToken",
    "bearerToken",
  ]);

const normalizeRoleValue = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const normalizeBackendRole = (value) => {
  const normalizedRole = normalizeRoleValue(value);

  if (["employee", "user", "manager"].includes(normalizedRole)) {
    return "user";
  }

  if (["superadmin", "superadministrator"].includes(normalizedRole)) {
    return "superadmin";
  }

  if (["admin", "administrator"].includes(normalizedRole)) {
    return "admin";
  }

  return "";
};

const LOGIN_ENDPOINTS = {
  admin: API_ENDPOINTS.auth.adminLogin,
  superadmin: API_ENDPOINTS.auth.superAdminLogin,
  user: API_ENDPOINTS.auth.userLogin,
};

const getRoleDisplayLabel = (role) => {
  const normalizedRole = normalizeBackendRole(role);

  if (normalizedRole === "superadmin") {
    return "SuperAdmin";
  }

  if (normalizedRole === "user") {
    return "User";
  }

  if (normalizedRole === "admin") {
    return "Admin";
  }

  return String(role ?? "").trim();
};

const getLoginAttemptOrder = () =>
  ["admin", "superadmin", "user"]
    .map((role) => ({
      role,
      endpoint: LOGIN_ENDPOINTS[role],
    }))
    .filter((attempt) => Boolean(attempt.endpoint));

const shouldRetryLoginAttempt = (error) => {
  const status = error?.response?.status;
  const message = String(
    error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.title ||
      error?.message ||
      ""
  )
    .trim()
    .toLowerCase();

  if ([400, 401, 403, 404, 405].includes(status)) {
    return true;
  }

  return /invalid|unauthor|credential|account|role not found|user not found|super admin not found|superadmin not found|employee not found|not found|not configured|does not exist|no matching/.test(
    message
  );
};

const submitLoginRequest = async (payload) => {
  const attempts = getLoginAttemptOrder();
  let lastError = null;

  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index];

    console.log("Endpoint:", attempt.endpoint);
    console.log("Payload:", payload);

    try {
      const response = await api.post(attempt.endpoint, payload, {
        skipAuth: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Status:", response.status);
      console.log("Response:", response.data);

      return {
        response,
        attemptedRole: attempt.role,
      };
    } catch (error) {
      lastError = error;

      console.log("Status:", error?.response?.status);
      console.log("Response:", error?.response?.data);
      console.log("Message:", error?.message);

      const hasAnotherAttempt = index < attempts.length - 1;

      if (hasAnotherAttempt && shouldRetryLoginAttempt(error)) {
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

const getResponseUserSnapshot = (response) =>
  response?.data?.user ||
  response?.data?.admin ||
  response?.data?.employee ||
  response?.data?.superAdmin ||
  response?.data?.authUser ||
  response?.data?.userData ||
  response?.data?.userInfo ||
  response?.data ||
  null;

const getLoginFailureMessage = (error) => {
  const status = error?.response?.status;
  const message = String(
    error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.title ||
      error?.message ||
      ""
  ).trim();

  if (message === "Login response was missing an access token.") {
    return message;
  }

  if (
    message === "Unable to determine the authenticated role from the backend response." ||
    message === "Login response did not include an access token or role."
  ) {
    return message;
  }

  if (status === 400) {
    return message || "Invalid request payload.";
  }

  if (status === 401) {
    return message || "Invalid email or password.";
  }

  if (status === 403) {
    return (
      message ||
      "Your account is disabled or you do not have access to sign in."
    );
  }

  if (status === 404) {
    return message || "Login endpoint was not found.";
  }

  if (status === 405) {
    return message || "Login method is not allowed.";
  }

  if (status >= 500) {
    return message || "Unexpected server error. Please try again.";
  }

  if (!error?.response && error?.request) {
    return "Network error. Please check your connection and try again.";
  }

  return message || "Login request failed.";
};

export default function LoginLeft() {
  const navigate = useNavigate();
  const adminPermissions = useAdminPermissions();
  const employeePermissions = useEmployeePermissions();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");

    if (savedEmail && savedPassword) {
      setForm({
        email: savedEmail,
        password: savedPassword,
      });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleRememberMe = (event) => {
    const checked = event.target.checked;
    setRememberMe(checked);

    if (!checked) {
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberPassword");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email address and password.");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    const loginPayload = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    setError("");
    setLoading(true);

    try {
      const storage = getAuthStorage(rememberMe);
      const { response, attemptedRole } = await submitLoginRequest(loginPayload);

      const payload = extractLoginPayload(response);
      const authUser = extractAuthenticatedUser(response) || {};
      const token = authUser.token || extractLoginToken(payload);
      const decodedToken = decodeJwtPayload(token) || {};
      const rawRole =
        authUser.role ||
        extractRole(decodedToken, payload) ||
        payload?.role ||
        payload?.Role ||
        attemptedRole;
      const detectedRole = normalizeBackendRole(rawRole) || attemptedRole;

      if (!token) {
        throw new Error("Login response was missing an access token.");
      }

      if (!detectedRole) {
        throw new Error(
          "Unable to determine the authenticated role from the backend response."
        );
      }

      const normalizedToken = normalizeAuthToken(token);
      const roleDisplayLabel = getRoleDisplayLabel(detectedRole);
      const roleList = roleDisplayLabel ? [roleDisplayLabel] : [];

      const refreshToken = authUser.refreshToken || "";
      const detectedUserId = authUser.id || extractUserId(decodedToken, payload);
      const employeeId =
        authUser.employeeId || extractEmployeeId(decodedToken, payload);
      const detectedAdminId =
        authUser.adminId ||
        extractAdminId(decodedToken, payload) ||
        detectedUserId ||
        employeeId;
      const superAdminId = authUser.superAdminId || "";
      const onboardingId =
        authUser.onboardingId || extractOnboardingId(decodedToken, payload);
      const email =
        authUser.email || extractEmail(decodedToken, payload, form.email);
      const displayName =
        authUser.displayName ||
        authUser.name ||
        authUser.userName ||
        authUser.fullName ||
        "";
      const fullName = displayName || email || form.email;
      const responseUser = getResponseUserSnapshot(response);
      const isEmployeeRole = ["employee", "user", "manager"].includes(detectedRole);
      const isSuperAdminRole = detectedRole === "superadmin";
      const selectedPermissionFlow = isSuperAdminRole
        ? "superadmin-bypass"
        : isEmployeeRole
          ? "role-permission"
          : "admin-permission";

      console.log("Authenticated Role:", detectedRole);
      console.log("Selected Permission Flow:", selectedPermissionFlow);
      console.log("Authenticated User:", responseUser);

      const userObject = {
        ...authUser,
        user: authUser.user || responseUser || null,
        token: normalizedToken,
        refreshToken,
        role: detectedRole,
        roleName: roleDisplayLabel,
        roles: roleList,
        userType: detectedRole,
        email,
        adminEmail: email,
        name: fullName,
        fullName,
        userName: fullName,
        displayName: fullName,
        id: detectedUserId,
        userId: detectedUserId,
        adminId: detectedAdminId,
        superAdminId,
        employeeId,
        onboardingId,
        allowedModules: [],
        modules: [],
        permissions: [],
      };

      clearAuthData();

      storage.setItem("token", normalizedToken);
      if (refreshToken) {
        storage.setItem("refreshToken", refreshToken);
      }
      storage.setItem("role", detectedRole);
      storage.setItem("roleName", roleDisplayLabel);
      storage.setItem("roles", JSON.stringify(roleList));
      storage.setItem("userType", detectedRole);
      storage.setItem("email", email || form.email);
      storage.setItem("adminEmail", email || form.email);
      storage.setItem("name", fullName);
      storage.setItem("fullName", fullName);
      storage.setItem("displayName", fullName);
      storage.setItem("user", JSON.stringify(userObject));
      if (isSuperAdminRole) {
        storage.setItem("isSuperAdmin", "true");
      }
      if (detectedUserId) {
        storage.setItem("userId", detectedUserId);
      }
      if (detectedAdminId) {
        storage.setItem("adminId", detectedAdminId);
      }
      if (superAdminId) {
        storage.setItem("superAdminId", superAdminId);
      }
      if (employeeId) {
        storage.setItem("employeeId", employeeId);
      }
      if (onboardingId) {
        storage.setItem("onboardingId", onboardingId);
      }

      localStorage.setItem("loginTime", String(Date.now()));

      if (rememberMe) {
        localStorage.setItem("rememberEmail", form.email);
        localStorage.setItem("rememberPassword", form.password);
      }

      try {
        startSessionTimer();
      } catch (sessionTimerError) {
        console.error("Session timer start failed", sessionTimerError);
      }

      let allowedModules = [];

      try {
        if (isSuperAdminRole) {
          console.log("Skipping permission API for Super Admin");

          const superAdminSnapshot = persistAdminPermissions(
            createSuperAdminPermissionSnapshot({
              adminId: superAdminId || detectedAdminId || detectedUserId || "",
              adminEmail: email || form.email,
            })
          );

          allowedModules = Array.isArray(superAdminSnapshot.modules)
            ? superAdminSnapshot.modules
            : [];
        } else {
          const permissionContext = isEmployeeRole
            ? employeePermissions
            : adminPermissions;
          const selectedPermissionApi = isEmployeeRole
            ? API_ENDPOINTS.rolePermission.allowedModules
            : API_ENDPOINTS.adminPermission.allowedModules;

          console.log("Selected Permission API:", selectedPermissionApi);

          const refreshedModules = await permissionContext.refreshPermissions({
            force: true,
          });
          allowedModules = Array.isArray(refreshedModules) ? refreshedModules : [];
        }
      } catch (permissionSyncError) {
        const isAuthFailure = isEmployeeRole
          ? isEmployeePermissionAuthFailure(permissionSyncError)
          : isAdminPermissionAuthFailure(permissionSyncError);

        if (isAuthFailure) {
          clearAuthData();
          setError(
            permissionSyncError?.message ||
              "We could not synchronize your permissions right now."
          );
          return;
        }

        console.error("Permission sync failed but the session remains active.", permissionSyncError);
      }

      const syncedUserObject = {
        ...userObject,
        allowedModules,
        modules: allowedModules,
        permissions: allowedModules,
      };

      storage.setItem("user", JSON.stringify(syncedUserObject));

      const redirectUrl = getDashboardPathForRole(detectedRole);
      console.log("Redirecting to:", redirectUrl);

      navigate(redirectUrl, {
        replace: true,
      });
    } catch (requestError) {
      console.error("Login Error:", requestError?.response?.data || requestError);
      setError(getLoginFailureMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-card-top">
        <div className="auth-card-head">
          <p className="auth-eyebrow">WELCOME BACK</p>
          <h2 className="auth-card-title">Sign in to Honeywell EMS</h2>
        </div>
      </div>

      {error ? <div className="auth-status auth-status-error">{error}</div> : null}

      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="Enter your email address"
          icon={FaEnvelope}
          required
        />

        <AuthField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          placeholder="Enter your password"
          icon={FaLock}
          required
          action={{
            label: showPassword ? "Hide password" : "Show password",
            icon: showPassword ? <FaEye /> : <FaEyeSlash />,
            onClick: () => setShowPassword((prev) => !prev),
          }}
        />

        <div className="auth-inline-row">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMe}
            />
            <span>Remember me</span>
          </label>

          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="auth-primary-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account?
        <Link to="/register" className="auth-link">
          Create account
        </Link>
      </p>
    </>
  );
}
