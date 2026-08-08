import React from "react";
import { FaArrowLeft, FaHome, FaShieldAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { getDashboardPathForRole, getUserRole } from "../utils/authorization";
import "./AccessDenied.css";

function AccessDenied() {
  const navigate = useNavigate();
  const location = useLocation();
  const dashboardPath = getDashboardPathForRole(getUserRole());
  const message =
    location.state?.message || "You are not authorized to access this page.";

  return (
    <div className="access-denied-page">
      <div className="access-denied-card app-surface">
        <div className="access-denied-badge">
          <FaShieldAlt />
          <span>403 Unauthorized</span>
        </div>

        <div className="access-denied-icon">
          <FaShieldAlt />
        </div>

        <h1>403 Unauthorized</h1>
        <p>{message}</p>

        <div className="access-denied-actions">
          <button
            type="button"
            className="app-button-secondary access-denied-secondary"
            onClick={() => navigate(dashboardPath, { replace: true })}
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <button
            type="button"
            className="app-button-primary access-denied-primary"
            onClick={() => navigate(dashboardPath, { replace: true })}
          >
            <FaHome />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
