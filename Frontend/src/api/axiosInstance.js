import axios from "axios";
import { BASE_URL } from "./config";
import { sortNestedCollectionsByRecency } from "../utils/collections";
import {
  getStoredJwtRole,
  getStoredRole,
  getStoredRoleName,
  getStoredToken,
} from "../utils/authStorage";
import { isAuthenticationFailureResponse } from "../utils/authorization";

import {
  handleAutoLogout,
  isSessionExpired,
} from "../utils/sessionManager";
 
import {
  endPerformanceTimer,
  startPerformanceTimer,
} from "../utils/performance";
 
const api = axios.create({
  baseURL: BASE_URL,
 
  headers: {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});
 
const inFlightGetRequests = new Map();

const resolveRequestUrl = (url, baseURL = BASE_URL) => {
  const requestUrl = String(url || "").trim();
  const requestBaseUrl = String(baseURL || "").trim();

  if (!requestUrl) {
    return requestBaseUrl || "";
  }

  if (/^https?:\/\//i.test(requestUrl)) {
    return requestUrl;
  }

  return `${String(requestBaseUrl || BASE_URL).replace(/\/+$/, "")}/${requestUrl.replace(/^\/+/, "")}`;
};

const headersForLogging = (headers) => {
  if (!headers) {
    return {};
  }

  const normalizedHeaders =
    typeof headers.toJSON === "function"
      ? headers.toJSON()
      : { ...headers };

  return Object.entries(normalizedHeaders).reduce((acc, [key, value]) => {
    acc[key] = String(key).toLowerCase() === "authorization" ? "[redacted]" : value;
    return acc;
  }, {});
};

const SENSITIVE_LOG_KEYS = new Set([
  "password",
  "token",
  "authtoken",
  "jwttoken",
  "accesstoken",
  "refreshtoken",
  "bearertoken",
]);

const sanitizeForLogging = (value) => {
  if (!value || typeof value !== "object") {
    return value ?? null;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeForLogging);
  }

  return Object.entries(value).reduce((acc, [key, nestedValue]) => {
    const normalizedKey = String(key).replace(/[_-]+/g, "").toLowerCase();
    acc[key] = SENSITIVE_LOG_KEYS.has(normalizedKey)
      ? "[redacted]"
      : sanitizeForLogging(nestedValue);
    return acc;
  }, {});
};
 
// =========================
// STABLE SERIALIZE
// =========================
const stableSerialize = (value) => {
  if (!value) {
    return "";
  }
 
  if (value instanceof URLSearchParams) {
    return value.toString();
  }
 
  if (Array.isArray(value)) {
    return `[${value
      .map(stableSerialize)
      .join(",")}]`;
  }
 
  if (typeof value === "object") {
    return JSON.stringify(
      Object.keys(value)
        .sort()
        .reduce((acc, key) => {
          acc[key] = value[key];
          return acc;
        }, {})
    );
  }
 
  return String(value);
};
 
// =========================
// REQUEST KEY
// =========================
const getRequestKey = (
  url,
  config = {}
) => {
 
  if (
    config.signal ||
    (
      config.responseType &&
      config.responseType !== "json"
    )
  ) {
    return null;
  }
 
  return `${url}?${stableSerialize(
    config.params
  )}`;
};
 
// =========================
// DEDUPE GET REQUESTS
// =========================
const originalGet =
  api.get.bind(api);
 
api.get = (
  url,
  config = {}
) => {
 
  const requestKey =
    config.dedupe === false
      ? null
      : getRequestKey(
          url,
          config
        );
 
  if (!requestKey) {
    return originalGet(
      url,
      config
    );
  }
 
  if (
    inFlightGetRequests.has(
      requestKey
    )
  ) {
    return inFlightGetRequests.get(
      requestKey
    );
  }
 
  const request =
    originalGet(
      url,
      config
    ).finally(() => {
 
      inFlightGetRequests.delete(
        requestKey
      );
 
    });
 
  inFlightGetRequests.set(
    requestKey,
    request
  );
 
  return request;
};
 
// =========================
// FORCE LOGOUT
// =========================
const shouldForceLogout = (
  config,
  status,
  data
) =>

  !config?.skipAuth &&
  !config?.skipAuthFailureHandling &&
  getStoredToken() &&
  isAuthenticationFailureResponse(status, data);

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(
 
  (config) => {
 
    const token =
      getStoredToken();
    const userRole =
      getStoredJwtRole() ||
      getStoredRoleName() ||
      getStoredRole();
 
    const method =
      (
        config.method ||
        "get"
      ).toUpperCase();
 
    const url =
      config.url || "";
    const requestUrl = resolveRequestUrl(url, config.baseURL || BASE_URL);

    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      if (typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    console.log("API Request", {
      url: requestUrl,
      method,
      baseURL: config.baseURL || BASE_URL,
      params: config.params || {},
      headers: headersForLogging(config.headers),
      hasToken: Boolean(token),
      body: sanitizeForLogging(config.data),
      userRole,
    });
 
    config.metadata = {
      ...(config.metadata || {}),
 
      performanceLabel:
        `api:${method}:${url}`,
    };
 
    startPerformanceTimer(
      config.metadata
        .performanceLabel
    );
 
    if (
      !config.skipAuth &&
      token
    ) {
 
      if (
        isSessionExpired()
      ) {
        endPerformanceTimer(
          config.metadata
            .performanceLabel
        );

        handleAutoLogout({
          reason: "Session expired before API request",
        });
 
        return Promise.reject(
          new axios.CanceledError(
            "Session expired"
          )
        );
      }
    }
 
    return config;
  },
 
  (error) =>
    Promise.reject(error)
);
 
// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
 
  // SUCCESS
  (response) => {
 
    endPerformanceTimer(
      response?.config?.metadata
        ?.performanceLabel
    );

    console.log("API Response", {
      status: response.status,
      url: resolveRequestUrl(
        response?.config?.url || "",
        response?.config?.baseURL || BASE_URL
      ),
      method: String(response?.config?.method || "get").toUpperCase(),
      data: sanitizeForLogging(response.data),
    });
 
    const responseType =
      response?.config
        ?.responseType;
 
    if (
      responseType &&
      responseType !== "json"
    ) {
 
      return response;
    }
 
    if (
      shouldForceLogout(
        response?.config,
        response?.status,
        response?.data
      )
    ) {
      handleAutoLogout({
        reason: "Authentication failure response",
      });

      return Promise.reject(
        new axios.CanceledError(
          "Session expired"
        )
      );
    }
 
    response.data =
      sortNestedCollectionsByRecency(
        response.data
      );
 
    return response;
  },
 
  // ERROR
  (error) => {
 
    const config =
      error?.config ||
      error?.response?.config ||
      {};
 
    const status =
      error?.response?.status;
 
    const data =
      error?.response?.data;

    endPerformanceTimer(
      config?.metadata
        ?.performanceLabel
    );

    if (error?.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    const isNotificationRequest =
      Boolean(config?.skipAuthFailureHandling);

    const errorLogger =
      isNotificationRequest
        ? console.warn
        : console.error;

    errorLogger(isNotificationRequest ? "API Warning" : "API Error", {
      status,
      message: error?.response?.data || error?.message,
      url: resolveRequestUrl(
        config?.url || error?.response?.config?.url || "",
        config?.baseURL || error?.response?.config?.baseURL || BASE_URL
      ),
      method: String(config?.method || error?.response?.config?.method || "get").toUpperCase(),
      params: config?.params || error?.response?.config?.params || {},
      headers: headersForLogging(config?.headers || error?.response?.config?.headers),
      hasToken: Boolean(getStoredToken()),
      body: sanitizeForLogging(config?.data ?? error?.response?.config?.data),
      responseData: sanitizeForLogging(data),
    });

    if (
      shouldForceLogout(
        config,
        status,
        data
      )
    ) {
      handleAutoLogout({
        reason: `Auth failure response (${status || "unknown status"})`,
      });
    }

    return Promise.reject(
      error
    );
  }
);
 
export default api;
 
