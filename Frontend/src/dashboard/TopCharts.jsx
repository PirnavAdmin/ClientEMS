import React, { memo } from "react";
import {
  FaUsers,
  FaBuilding,
  FaProjectDiagram,
  FaCalendarCheck,
} from "react-icons/fa";

function TopCharts({
  data = {},
  loading = false,
}) {
  const renderValue = (value, suffix = "") => {
    if (
      loading ||
      value === undefined ||
      value === null
    ) {
      return <div className="card-skeleton value-loader" />;
    }

    return (
      <h2 className="card-value">
        {value}
        {suffix}
      </h2>
    );
  };

  return (
    <div className="cards">
      <div className="card">
        <div className="card-top">
          <div>
            <p className="card-label">Total Employees</p>
            {renderValue(data?.totalEmployees)}
            <span className="card-change blue">Total</span>
          </div>

          <div className="icon blue">
            <FaUsers />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-top">
          <div>
            <p className="card-label">Departments</p>
            {renderValue(data?.totalDepartments)}
            <span className="card-change">Active</span>
          </div>

          <div className="icon blue">
            <FaBuilding />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-top">
          <div>
            <p className="card-label">Active Projects</p>
            {renderValue(data?.activeProjects)}
            <span className="card-change">Running</span>
          </div>

          <div className="icon orange">
            <FaProjectDiagram />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-top">
          <div>
            <p className="card-label">Attendance Today</p>
            {renderValue(data?.attendancePercentage, "%")}
            <span className="card-change blue">Today</span>
          </div>

          <div className="icon blue">
            <FaCalendarCheck />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TopCharts);
