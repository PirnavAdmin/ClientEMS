import { API_ENDPOINTS } from "../../api/endpoints";

const text = (name, label, options = {}) => ({
  name,
  label,
  type: "text",
  ...options,
});

const number = (name, label, options = {}) => ({
  name,
  label,
  type: "number",
  ...options,
});

const date = (name, label, options = {}) => ({
  name,
  label,
  type: "date",
  ...options,
});

const time = (name, label, options = {}) => ({
  name,
  label,
  type: "time",
  ...options,
});

const textarea = (name, label, options = {}) => ({
  name,
  label,
  type: "textarea",
  fullWidth: true,
  ...options,
});

const select = (name, label, options = [], extra = {}) => ({
  name,
  label,
  type: "select",
  options,
  ...extra,
});

const baseAuditColumns = [
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created" },
];

const approvalOptions = [
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

export const standaloneSettingsModules = {
  appraisal: {
    route: "/settings/appraisal",
    title: "Appraisal Settings",
    category: "Performance Management",
    moduleName: "Appraisal",
    description: "Manage appraisal cycles, scores, and review workflows.",
    api: {
      list: API_ENDPOINTS.appraisal.list,
      create: API_ENDPOINTS.appraisal.create,
      get: API_ENDPOINTS.appraisal.byEmployee,
      delete: API_ENDPOINTS.appraisal.delete,
    },
    idKey: "id",
    columns: [
      { key: "employeeId", label: "Employee" },
      { key: "cycleId", label: "Cycle" },
      { key: "rating", label: "Rating" },
      ...baseAuditColumns,
    ],
    formFields: [
      text("employeeId", "Employee", { required: true }),
      text("cycleId", "Performance Cycle", { required: true }),
      number("rating", "Rating"),
      textarea("comments", "Comments"),
    ],
    searchFields: ["employeeId", "employeeName", "cycleId", "status", "rating"],
    workflowButtons: [
      {
        key: "managerReview",
        label: "Manager Review",
        endpoint: API_ENDPOINTS.appraisal.managerReview,
        permission: "workflow",
        fields: [
          select("status", "Status", approvalOptions, { required: true }),
          textarea("comments", "Comments"),
        ],
      },
      {
        key: "hrReview",
        label: "HR Review",
        endpoint: API_ENDPOINTS.appraisal.hrReview,
        permission: "workflow",
        fields: [
          select("status", "Status", approvalOptions, { required: true }),
          textarea("comments", "Comments"),
        ],
      },
    ],
  },
  employeeGoals: {
    route: "/settings/employee-goals",
    title: "Employee Goal Settings",
    category: "Performance Management",
    moduleName: "Employee Goal",
    description: "Create and update employee goals.",
    api: {
      list: API_ENDPOINTS.employeeGoal.list,
      create: API_ENDPOINTS.employeeGoal.create,
      get: API_ENDPOINTS.employeeGoal.byEmployee,
      update: API_ENDPOINTS.employeeGoal.update,
      delete: API_ENDPOINTS.employeeGoal.delete,
    },
    idKey: "id",
    columns: [
      { key: "employeeId", label: "Employee" },
      { key: "goalTitle", label: "Goal" },
      { key: "targetDate", label: "Target Date" },
      ...baseAuditColumns,
    ],
    formFields: [
      text("employeeId", "Employee", { required: true }),
      text("goalTitle", "Goal Title", { required: true }),
      date("targetDate", "Target Date"),
      textarea("description", "Description"),
    ],
    searchFields: ["employeeId", "employeeName", "goalTitle", "status"],
  },
  goalReview: {
    route: "/settings/goal-review",
    title: "Goal Review Settings",
    category: "Performance Management",
    moduleName: "Goal Review",
    description: "Track goal review results and feedback.",
    api: {
      list: API_ENDPOINTS.goalReview.list,
      create: API_ENDPOINTS.goalReview.create,
      update: API_ENDPOINTS.goalReview.update,
      delete: API_ENDPOINTS.goalReview.delete,
    },
    idKey: "id",
    columns: [
      { key: "goalId", label: "Goal" },
      { key: "reviewerId", label: "Reviewer" },
      { key: "rating", label: "Rating" },
      ...baseAuditColumns,
    ],
    formFields: [
      text("goalId", "Goal", { required: true }),
      text("reviewerId", "Reviewer", { required: true }),
      number("rating", "Rating"),
      textarea("feedback", "Feedback"),
    ],
    searchFields: ["goalId", "reviewerId", "rating", "status"],
  },
  performanceCycle: {
    route: "/settings/performance-cycle",
    title: "Performance Cycle Settings",
    category: "Performance Management",
    moduleName: "Performance Cycle",
    description: "Configure performance cycles and review periods.",
    api: {
      list: API_ENDPOINTS.performanceCycle.list,
      create: API_ENDPOINTS.performanceCycle.create,
      get: API_ENDPOINTS.performanceCycle.byId,
      update: API_ENDPOINTS.performanceCycle.update,
      delete: API_ENDPOINTS.performanceCycle.delete,
    },
    idKey: "id",
    columns: [
      { key: "cycleName", label: "Cycle Name" },
      { key: "startDate", label: "Start Date" },
      { key: "endDate", label: "End Date" },
      ...baseAuditColumns,
    ],
    formFields: [
      text("cycleName", "Cycle Name", { required: true }),
      date("startDate", "Start Date", { required: true }),
      date("endDate", "End Date", { required: true }),
      textarea("description", "Description"),
    ],
    searchFields: ["cycleName", "status", "startDate", "endDate"],
  },
  resignation: {
    route: "/settings/resignation",
    title: "Employee Resignation Settings",
    category: "Employee Exit Management",
    moduleName: "Employee Resignation",
    description: "Manage resignations and approval workflows.",
    api: {
      list: API_ENDPOINTS.employeeResignation.list,
      create: API_ENDPOINTS.employeeResignation.apply,
      get: API_ENDPOINTS.employeeResignation.byId,
      update: API_ENDPOINTS.employeeResignation.update,
      delete: API_ENDPOINTS.employeeResignation.delete,
    },
    idKey: "resignationId",
    columns: [
      { key: "employeeId", label: "Employee" },
      { key: "resignationDate", label: "Resignation Date" },
      { key: "lastWorkingDate", label: "Last Working Date" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      text("employeeId", "Employee", { required: true }),
      date("resignationDate", "Resignation Date", { required: true }),
      date("lastWorkingDate", "Last Working Date"),
      textarea("reason", "Reason", { required: true }),
    ],
    searchFields: ["employeeId", "employeeName", "status", "reason"],
    workflowButtons: [
      {
        key: "managerApproval",
        label: "Manager Approval",
        endpoint: API_ENDPOINTS.employeeResignation.managerApproval,
        method: "put",
        permission: "approve",
        fields: [
          select("status", "Status", approvalOptions, { required: true }),
          textarea("comments", "Comments"),
        ],
      },
      {
        key: "hrApproval",
        label: "HR Approval",
        endpoint: API_ENDPOINTS.employeeResignation.hrApproval,
        method: "put",
        permission: "approve",
        fields: [
          select("status", "Status", approvalOptions, { required: true }),
          textarea("comments", "Comments"),
        ],
      },
    ],
  },
  employeeClearance: {
    route: "/settings/employee-clearance",
    title: "Employee Clearance Settings",
    category: "Employee Exit Management",
    moduleName: "Employee Clearance",
    description: "Create and update department clearance records.",
    api: {
      list: API_ENDPOINTS.employeeClearance.pending,
      create: API_ENDPOINTS.employeeClearance.create,
      update: API_ENDPOINTS.employeeClearance.department,
    },
    idKey: "clearanceId",
    columns: [
      { key: "resignationId", label: "Resignation" },
      { key: "employeeId", label: "Employee" },
      { key: "department", label: "Department" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      text("resignationId", "Resignation", { required: true }),
      text("employeeId", "Employee"),
      text("department", "Department", { required: true }),
      select("status", "Status", approvalOptions),
      textarea("remarks", "Remarks"),
    ],
    filters: [
      {
        key: "statusView",
        label: "Status",
        options: [
          { value: "pending", label: "Pending", endpoint: API_ENDPOINTS.employeeClearance.pending },
          { value: "completed", label: "Completed", endpoint: API_ENDPOINTS.employeeClearance.completed },
        ],
      },
    ],
    searchFields: ["resignationId", "employeeId", "department", "status"],
  },
  exitInterview: {
    route: "/settings/exit-interview",
    title: "Exit Interview Settings",
    category: "Employee Exit Management",
    moduleName: "Exit Interview",
    description: "Capture exit interview notes and feedback.",
    api: {
      list: API_ENDPOINTS.exitInterview.list,
      create: API_ENDPOINTS.exitInterview.create,
      delete: API_ENDPOINTS.exitInterview.delete,
    },
    idKey: "exitInterviewId",
    columns: [
      { key: "resignationId", label: "Resignation" },
      { key: "employeeId", label: "Employee" },
      { key: "interviewDate", label: "Interview Date" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      text("resignationId", "Resignation", { required: true }),
      date("interviewDate", "Interview Date"),
      textarea("feedback", "Feedback"),
      textarea("remarks", "Remarks"),
    ],
    searchFields: ["resignationId", "employeeId", "feedback", "status"],
  },
  fullFinalSettlement: {
    route: "/settings/full-final-settlement",
    title: "Full Final Settlement Settings",
    category: "Employee Exit Management",
    moduleName: "Full Final Settlement",
    description: "Generate and approve full and final settlement records.",
    api: {
      list: API_ENDPOINTS.fullFinalSettlement.list,
      create: API_ENDPOINTS.fullFinalSettlement.generate,
      get: API_ENDPOINTS.fullFinalSettlement.byEmployee,
      delete: API_ENDPOINTS.fullFinalSettlement.delete,
    },
    idKey: "settlementId",
    columns: [
      { key: "employeeId", label: "Employee" },
      { key: "netAmount", label: "Net Amount" },
      { key: "settlementDate", label: "Settlement Date" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      text("employeeId", "Employee", { required: true }),
      date("settlementDate", "Settlement Date"),
      number("netAmount", "Net Amount"),
      textarea("remarks", "Remarks"),
    ],
    searchFields: ["employeeId", "status", "netAmount", "remarks"],
    workflowButtons: [
      {
        key: "approve",
        label: "Approve",
        endpoint: API_ENDPOINTS.fullFinalSettlement.approve,
        method: "put",
        permission: "approve",
        fields: [
          select("status", "Status", approvalOptions, { required: true }),
          textarea("remarks", "Remarks"),
        ],
      },
    ],
  },
};

export const shiftModulesConfig = {
  shiftMaster: {
    title: "Shift Master",
    category: "Shift Module",
    moduleName: "Shift Master",
    api: {
      list: API_ENDPOINTS.shift.list,
      create: API_ENDPOINTS.shift.create,
      get: API_ENDPOINTS.shift.byId,
      update: API_ENDPOINTS.shift.update,
      delete: API_ENDPOINTS.shift.delete,
    },
    idKey: "id",
    columns: [
      { key: "shiftName", label: "Shift Name" },
      { key: "startTime", label: "Start Time" },
      { key: "endTime", label: "End Time" },
      { key: "graceTime", label: "Grace Time" },
    ],
    formFields: [
      text("shiftName", "Shift Name", { required: true }),
      time("startTime", "Start Time", { required: true }),
      time("endTime", "End Time", { required: true }),
      number("graceTime", "Grace Time"),
      textarea("description", "Description"),
    ],
    searchFields: ["shiftName", "description", "startTime", "endTime"],
  },
  employeeShift: {
    title: "Employee Shift Assignment",
    category: "Shift Module",
    moduleName: "Employee Shift",
    api: {
      list: API_ENDPOINTS.employeeShift.list,
      create: API_ENDPOINTS.employeeShift.assign,
      get: API_ENDPOINTS.employeeShift.byEmployee,
      delete: API_ENDPOINTS.employeeShift.delete,
    },
    idKey: "assignmentId",
    columns: [
      { key: "employeeId", label: "Employee" },
      { key: "shiftId", label: "Shift" },
      { key: "effectiveDate", label: "Effective Date" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      text("employeeId", "Employee", { required: true }),
      text("shiftId", "Shift", { required: true }),
      date("effectiveDate", "Effective Date", { required: true }),
    ],
    searchFields: ["employeeId", "employeeName", "shiftId", "shiftName", "status"],
    bulkUpload: {
      label: "Bulk Assign",
      endpoint: API_ENDPOINTS.employeeShift.bulkAssign,
      fileField: "file",
      permission: "bulkUpload",
    },
  },
  weeklyOff: {
    title: "Weekly Off",
    category: "Shift Module",
    moduleName: "Weekly Off",
    api: {
      list: API_ENDPOINTS.employeeWeeklyOff.list,
      create: API_ENDPOINTS.employeeWeeklyOff.create,
      get: API_ENDPOINTS.employeeWeeklyOff.byId,
      update: API_ENDPOINTS.employeeWeeklyOff.update,
      delete: API_ENDPOINTS.employeeWeeklyOff.delete,
    },
    idKey: "id",
    columns: [
      { key: "employeeId", label: "Employee" },
      { key: "weekDay", label: "Week Day" },
      { key: "effectiveDate", label: "Effective Date" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      text("employeeId", "Employee"),
      select("weekDay", "Week Day", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], { required: true }),
      date("effectiveDate", "Effective Date", { required: true }),
    ],
    searchFields: ["employeeId", "employeeName", "weekDay", "status"],
  },
  shiftPlanner: {
    title: "Shift Planner",
    category: "Shift Module",
    moduleName: "Shift Planner",
    api: {
      list: API_ENDPOINTS.shiftPlanner.list,
      create: API_ENDPOINTS.shiftPlanner.create,
      get: API_ENDPOINTS.shiftPlanner.byId,
      update: API_ENDPOINTS.shiftPlanner.update,
      delete: API_ENDPOINTS.shiftPlanner.delete,
    },
    idKey: "id",
    columns: [
      { key: "week", label: "Week" },
      { key: "month", label: "Month" },
      { key: "year", label: "Year" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      number("week", "Week"),
      number("month", "Month", { required: true }),
      number("year", "Year", { required: true }),
      textarea("planner", "Planner", { required: true }),
    ],
    searchFields: ["week", "month", "year", "status"],
    workflowButtons: [
      {
        key: "publish",
        label: "Publish",
        endpoint: API_ENDPOINTS.shiftPlanner.publish,
        permission: "publish",
      },
      {
        key: "copyWeek",
        label: "Copy Week",
        endpoint: API_ENDPOINTS.shiftPlanner.copyWeek,
        permission: "copy",
        fields: [
          number("sourceWeek", "Source Week", { required: true }),
          number("targetWeek", "Target Week", { required: true }),
          number("year", "Year", { required: true }),
        ],
      },
      {
        key: "copyMonth",
        label: "Copy Month",
        endpoint: API_ENDPOINTS.shiftPlanner.copyMonth,
        permission: "copy",
        fields: [
          number("sourceMonth", "Source Month", { required: true }),
          number("targetMonth", "Target Month", { required: true }),
          number("year", "Year", { required: true }),
        ],
      },
    ],
  },
  shiftRotation: {
    title: "Shift Rotation",
    category: "Shift Module",
    moduleName: "Shift Rotation",
    api: {
      list: API_ENDPOINTS.shiftRotation.list,
      create: API_ENDPOINTS.shiftRotation.create,
      get: API_ENDPOINTS.shiftRotation.byId,
      update: API_ENDPOINTS.shiftRotation.update,
      delete: API_ENDPOINTS.shiftRotation.delete,
    },
    idKey: "id",
    columns: [
      { key: "rotationType", label: "Rotation Type" },
      { key: "employeeId", label: "Employee" },
      { key: "shiftId", label: "Shift" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      text("rotationType", "Rotation Type", { required: true }),
      text("employeeId", "Employee", { required: true }),
      text("shiftId", "Shift", { required: true }),
      textarea("description", "Description"),
    ],
    searchFields: ["rotationType", "employeeId", "shiftId", "status"],
  },
  shiftSwap: {
    title: "Shift Swap",
    category: "Shift Module",
    moduleName: "Shift Swap",
    api: {
      list: API_ENDPOINTS.shiftSwap.list,
      create: API_ENDPOINTS.shiftSwap.create,
      get: API_ENDPOINTS.shiftSwap.byId,
      delete: API_ENDPOINTS.shiftSwap.delete,
    },
    idKey: "id",
    columns: [
      { key: "employeeId", label: "Employee" },
      { key: "swapEmployeeId", label: "Swap Employee" },
      { key: "reason", label: "Reason" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      text("employeeId", "Employee", { required: true }),
      text("swapEmployeeId", "Swap Employee", { required: true }),
      textarea("reason", "Reason", { required: true }),
    ],
    searchFields: ["employeeId", "swapEmployeeId", "reason", "status"],
    workflowButtons: [
      {
        key: "approve",
        label: "Approve",
        endpoint: API_ENDPOINTS.shiftSwap.approve,
        permission: "approve",
        fields: [
          select("status", "Status", approvalOptions, { required: true }),
          textarea("comments", "Comments"),
        ],
      },
    ],
  },
  shiftChangeRequest: {
    title: "Shift Change Requests",
    category: "Shift Module",
    moduleName: "Shift Change Request",
    api: {
      list: API_ENDPOINTS.shiftChangeRequest.list,
      create: API_ENDPOINTS.shiftChangeRequest.create,
      get: API_ENDPOINTS.shiftChangeRequest.byId,
      delete: API_ENDPOINTS.shiftChangeRequest.delete,
    },
    idKey: "id",
    columns: [
      { key: "employeeId", label: "Employee" },
      { key: "requestedShiftId", label: "Requested Shift" },
      { key: "reason", label: "Reason" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      text("employeeId", "Employee", { required: true }),
      text("requestedShiftId", "Requested Shift", { required: true }),
      textarea("reason", "Reason", { required: true }),
    ],
    searchFields: ["employeeId", "requestedShiftId", "reason", "status"],
    workflowButtons: [
      {
        key: "approve",
        label: "Approve",
        endpoint: API_ENDPOINTS.shiftChangeRequest.approve,
        permission: "approve",
        fields: [
          select("status", "Status", approvalOptions, { required: true }),
          textarea("comments", "Comments"),
        ],
      },
    ],
  },
  shiftRoster: {
    title: "Shift Roster",
    category: "Shift Module",
    moduleName: "Shift Roster",
    api: {
      list: API_ENDPOINTS.shiftRoster.list,
      create: API_ENDPOINTS.shiftRoster.create,
      get: API_ENDPOINTS.shiftRoster.byId,
      update: API_ENDPOINTS.shiftRoster.update,
      delete: API_ENDPOINTS.shiftRoster.delete,
    },
    idKey: "id",
    columns: [
      { key: "employeeId", label: "Employee" },
      { key: "shiftId", label: "Shift" },
      { key: "date", label: "Date" },
      { key: "status", label: "Status" },
    ],
    formFields: [
      text("employeeId", "Employee", { required: true }),
      text("shiftId", "Shift", { required: true }),
      date("date", "Date", { required: true }),
    ],
    searchFields: ["employeeId", "employeeName", "shiftId", "shiftName", "date", "status"],
    workflowButtons: [
      {
        key: "employeeRoster",
        label: "Employee Roster",
        endpoint: API_ENDPOINTS.shiftRoster.byEmployee,
        method: "get",
        permission: "workflow",
        fields: [text("employeeId", "Employee", { required: true })],
      },
    ],
    bulkUpload: {
      label: "Bulk Upload",
      endpoint: API_ENDPOINTS.shiftRoster.bulk,
      fileField: "file",
      permission: "bulkUpload",
    },
  },
};

export const shiftModuleOptions = Object.entries(shiftModulesConfig).map(
  ([key, config]) => ({
    value: key,
    label: config.title,
  })
);
