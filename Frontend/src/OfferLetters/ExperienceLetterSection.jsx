import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaFileAlt,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import AppDatePicker from "../components/AppDatePicker";
import CompactSearchableDropdown from "../components/CompactSearchableDropdown";
import DocumentSendStatusButton from "../components/documentSendStatus/DocumentSendStatusButton";
import {
  deleteExperienceLetter,
  downloadExperienceLetter,
  generateExperienceLetter,
  getAllExperienceLetters,
  previewExperienceLetter,
  sendExperienceLetter,
} from "../services/experienceLetterService";
import { getOfferLetterApiErrorMessage } from "../services/offerLetterService";
import { formatDate } from "../utils/date";
import { extractDownloadFileName } from "../utils/downloadUtils";
import { resolveDocumentMimeType } from "../Employees/AddEmployee/documentPreview";
import {
  OfferLetterDeleteModal,
  OfferLetterPreviewModal,
  OfferLetterSendModal,
} from "./OfferLetterDialogs";
import { buildExperienceLetterEmailDraft } from "./experienceLetterDraft";

const redirectToLogin = () => {
  window.location.replace("/login");
  return true;
};

const EXPERIENCE_TITLE_OPTIONS = [
  { label: "Mr", value: "Mr" },
  { label: "Ms", value: "Ms" },
  { label: "Mrs", value: "Mrs" },
];

const getEmployeeId = (employee) =>
  employee?.employee_Id ||
  employee?.employee_id ||
  employee?.employeeId ||
  employee?.id ||
  "";

const formatDisplayValue = (value) => {
  const normalizedValue = String(value ?? "").trim();
  return normalizedValue || "-";
};

const getEmployeeDropdownName = (employee) =>
  formatDisplayValue(
    employee?.employeeName ||
      employee?.name ||
      employee?.fullName ||
      [employee?.firstName, employee?.middleName, employee?.lastName]
        .filter(Boolean)
        .join(" ")
  );

const getEmployeeDropdownSortKey = (employee) =>
  String(
    employee?.employeeName ||
      employee?.name ||
      employee?.fullName ||
      [employee?.firstName, employee?.middleName, employee?.lastName]
        .filter(Boolean)
        .join(" ") ||
      getEmployeeId(employee) ||
      ""
  )
    .trim()
    .toLowerCase();

const getEmployeeDropdownLabel = (employee) => {
  const employeeId = formatDisplayValue(getEmployeeId(employee));
  const employeeName = getEmployeeDropdownName(employee);

  return `${employeeId} - ${employeeName}`;
};

const normalizeEmployeesForDropdown = (employeeList) => {
  const uniqueEmployees = new Map();

  (Array.isArray(employeeList) ? employeeList : []).forEach((employee) => {
    const employeeId = formatDisplayValue(getEmployeeId(employee));

    if (!employeeId || employeeId === "-") {
      return;
    }

    const normalizedIdKey = employeeId.toLowerCase();

    if (!uniqueEmployees.has(normalizedIdKey)) {
      uniqueEmployees.set(normalizedIdKey, employee);
    }
  });

  return Array.from(uniqueEmployees.values()).sort((left, right) => {
    const leftName = getEmployeeDropdownSortKey(left);
    const rightName = getEmployeeDropdownSortKey(right);
    const nameCompare = leftName.localeCompare(rightName, undefined, {
      sensitivity: "base",
      numeric: true,
    });

    if (nameCompare !== 0) {
      return nameCompare;
    }

    return formatDisplayValue(getEmployeeId(left)).localeCompare(
      formatDisplayValue(getEmployeeId(right)),
      undefined,
      {
        sensitivity: "base",
        numeric: true,
      }
    );
  });
};

const getExperienceLetterEmployeeId = (letter) =>
  letter?.employeeId ||
  letter?.employee_Id ||
  letter?.employee_id ||
  letter?.id ||
  "";

const getExperienceLetterId = (letter) =>
  letter?.id ||
  letter?.experienceLetterId ||
  letter?.experience_Letter_Id ||
  letter?.experience_letter_id ||
  "";

const getExperienceLetterEmployeeLabel = (letter) =>
  letter?.employeeName ||
  letter?.employee_Name ||
  letter?.employee_name ||
  letter?.name ||
  letter?.fullName ||
  letter?.full_Name ||
  getExperienceLetterEmployeeId(letter) ||
  "-";

const getExperienceLetterEmployeeEmail = (letter) =>
  letter?.employeeEmail ||
  letter?.employee_Email ||
  letter?.employee_email ||
  letter?.email ||
  letter?.mail ||
  "";

const formatExperienceTableValue = (value) => {
  const normalizedValue = String(value ?? "").trim();
  return normalizedValue || "-";
};

const getExperienceLetterStatus = (letter) =>
  letter?.status || letter?.sendStatus || letter?.letterStatus || "Not Sent";

function ExperienceLetterSection() {
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [experienceDownloadingId, setExperienceDownloadingId] = useState(null);
  const [experienceErrors, setExperienceErrors] = useState({});
  const [experienceForm, setExperienceForm] = useState({
    employeeId: "",
    title: "",
    designation: "",
    department: "",
    endDate: "",
    authorizedSignatory: "",
    authorizedSignatoryDesignation: "",
  });
  const [generatedExperienceLetters, setGeneratedExperienceLetters] = useState([]);
  const [loadingExperienceLetters, setLoadingExperienceLetters] = useState(false);
  const [previewExperienceLetterTarget, setPreviewExperienceLetterTarget] =
    useState(null);
  const [previewExperienceLetterLoading, setPreviewExperienceLetterLoading] =
    useState(false);
  const [previewExperienceLetterError, setPreviewExperienceLetterError] =
    useState("");
  const [previewExperienceLetterBlob, setPreviewExperienceLetterBlob] =
    useState(null);
  const [
    previewExperienceLetterContentType,
    setPreviewExperienceLetterContentType,
  ] = useState("");
  const previewExperienceRequestRef = useRef(0);
  const [sendExperienceLetterOpen, setSendExperienceLetterOpen] = useState(false);
  const [sendExperienceLetterTarget, setSendExperienceLetterTarget] =
    useState(null);
  const [sendExperienceLetterSubject, setSendExperienceLetterSubject] =
    useState("");
  const [sendExperienceLetterBody, setSendExperienceLetterBody] = useState("");
  const [sendExperienceLetterErrors, setSendExperienceLetterErrors] = useState({});
  const [sendingExperienceLetterId, setSendingExperienceLetterId] = useState(null);
  const [deleteExperienceLetterTarget, setDeleteExperienceLetterTarget] =
    useState(null);
  const [deletingExperienceLetterId, setDeletingExperienceLetterId] =
    useState(null);
  const sendRequestLockRef = useRef(false);

  const getToken = () => localStorage.getItem("token");

  const getResponseHeaderValue = (headers, key) =>
    headers?.[key] || headers?.[key.toLowerCase()] || headers?.[key.toUpperCase()];

  const employeeDropdownGroups = useMemo(
    () => [
      {
        label: "Employees",
        options: employees.map((employee) => ({
          value: getEmployeeId(employee),
          label: getEmployeeDropdownLabel(employee),
          searchText: [
            getEmployeeId(employee),
            getEmployeeDropdownName(employee),
            employee?.email,
            employee?.department,
            employee?.designation,
          ]
            .filter(Boolean)
            .join(" "),
        })),
      },
    ],
    [employees]
  );

  const findEmployeeForExperienceLetter = useCallback(
    (letter) => {
      const employeeId = String(getExperienceLetterEmployeeId(letter) || "");
      if (!employeeId) {
        return null;
      }

      return (
        employees.find(
          (employee) => String(getEmployeeId(employee)) === employeeId
        ) || null
      );
    },
    [employees]
  );

  const getExperienceLetterRecipientName = useCallback(
    (letter) => {
      if (!letter) {
        return "";
      }

      const employee = findEmployeeForExperienceLetter(letter);
      return getEmployeeDropdownName(employee) || getExperienceLetterEmployeeLabel(letter);
    },
    [findEmployeeForExperienceLetter]
  );

  const getExperienceLetterRecipientEmail = useCallback(
    (letter) => {
      if (!letter) {
        return "";
      }

      const employee = findEmployeeForExperienceLetter(letter);
      return getExperienceLetterEmployeeEmail(letter) || employee?.email || "";
    },
    [findEmployeeForExperienceLetter]
  );

  const loadExperienceLetters = useCallback(async () => {
    try {
      const token = getToken();

      if (!token) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          redirectToLogin();
        }, 1200);
        return;
      }

      setLoadingExperienceLetters(true);

      const response = await getAllExperienceLetters();
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setGeneratedExperienceLetters(data);
    } catch (error) {
      console.error("Experience Letters Load Error:", error);
      const message = await getOfferLetterApiErrorMessage(
        error,
        "Unable to load experience letters.",
        "experience letter"
      );
      toast.error(message);
    } finally {
      setLoadingExperienceLetters(false);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      setEmployeesLoading(true);

      const token = getToken();

      if (!token) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          redirectToLogin();
        }, 1200);
        return;
      }

      const res = await api.get(API_ENDPOINTS.employees.list, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setEmployees(normalizeEmployeesForDropdown(data));
    } catch (error) {
      console.error("Employees Fetch Error:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setEmployeesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    loadExperienceLetters();
  }, [fetchEmployees, loadExperienceLetters]);

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;

    setExperienceErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setExperienceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExperienceEmployeeChange = useCallback((employeeId) => {
    setExperienceErrors((prev) => ({
      ...prev,
      employeeId: "",
    }));

    setExperienceForm((prev) => ({
      ...prev,
      employeeId,
    }));
  }, []);

  const validateExperienceForm = () => {
    const errors = {};

    if (!experienceForm.employeeId) {
      errors.employeeId = "Employee is required";
    }
    if (!experienceForm.title) {
      errors.title = "Title is required";
    }
    if (!experienceForm.designation.trim()) {
      errors.designation = "Designation is required";
    }
    if (!experienceForm.department.trim()) {
      errors.department = "Department is required";
    }
    if (!experienceForm.endDate) {
      errors.endDate = "End Date is required";
    }
    if (!experienceForm.authorizedSignatory.trim()) {
      errors.authorizedSignatory = "Authorized Signatory is required";
    }
    if (!experienceForm.authorizedSignatoryDesignation.trim()) {
      errors.authorizedSignatoryDesignation =
        "Authorized Signatory Designation is required";
    }

    setExperienceErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateExperienceLetter = async () => {
    if (!validateExperienceForm()) return;

    try {
      setExperienceLoading(true);

      const payload = {
        employeeId: experienceForm.employeeId,
        title: experienceForm.title,
        designation: experienceForm.designation,
        department: experienceForm.department,
        endDate: experienceForm.endDate,
        authorizedSignatory: experienceForm.authorizedSignatory,
        authorizedSignatoryDesignation:
          experienceForm.authorizedSignatoryDesignation,
      };

      await generateExperienceLetter(payload);

      toast.success("Experience Letter Generated Successfully");
      await loadExperienceLetters();

      setExperienceForm({
        employeeId: "",
        title: "",
        designation: "",
        department: "",
        endDate: "",
        authorizedSignatory: "",
        authorizedSignatoryDesignation: "",
      });
      setExperienceErrors({});
    } catch (error) {
      console.error("Experience Generate Error:", error);
      const message = await getOfferLetterApiErrorMessage(
        error,
        "Unable to generate experience letter.",
        "experience letter"
      );
      toast.error(message);
    } finally {
      setExperienceLoading(false);
    }
  };

  const handleDownloadExperienceLetter = async (id) => {
    try {
      setExperienceDownloadingId(id);

      const response = await downloadExperienceLetter(id);
      const contentType =
        getResponseHeaderValue(response.headers, "content-type") ||
        response.data?.type ||
        "application/pdf";
      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download =
        extractDownloadFileName(response.headers) || "ExperienceLetter.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Experience Letter Downloaded");
    } catch (error) {
      console.error("Experience Download Error:", error);
      const message = await getOfferLetterApiErrorMessage(
        error,
        "Unable to download experience letter.",
        "experience letter"
      );
      toast.error(message);
    } finally {
      setExperienceDownloadingId(null);
    }
  };

  const closePreviewExperienceLetterModal = () => {
    previewExperienceRequestRef.current += 1;
    setPreviewExperienceLetterTarget(null);
    setPreviewExperienceLetterLoading(false);
    setPreviewExperienceLetterError("");
    setPreviewExperienceLetterBlob(null);
    setPreviewExperienceLetterContentType("");
  };

  const handlePreviewExperienceLetter = async (experienceLetter) => {
    const experienceLetterId = getExperienceLetterId(experienceLetter);

    if (!experienceLetterId) {
      toast.error("Unable to preview this experience letter.");
      return;
    }

    const requestId = previewExperienceRequestRef.current + 1;
    previewExperienceRequestRef.current = requestId;

    setPreviewExperienceLetterTarget(experienceLetter);
    setPreviewExperienceLetterLoading(true);
    setPreviewExperienceLetterError("");
    setPreviewExperienceLetterBlob(null);
    setPreviewExperienceLetterContentType("");

    try {
      const response = await previewExperienceLetter(experienceLetterId);

      if (previewExperienceRequestRef.current !== requestId) {
        return;
      }

      const contentType =
        getResponseHeaderValue(response.headers, "content-type") ||
        response.data?.type ||
        "";
      const previewBlob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], {
              type: resolveDocumentMimeType(contentType, ""),
            });

      setPreviewExperienceLetterBlob(previewBlob);
      setPreviewExperienceLetterContentType(contentType || previewBlob.type || "");
      setPreviewExperienceLetterLoading(false);
    } catch (error) {
      if (previewExperienceRequestRef.current !== requestId) {
        return;
      }

      console.error("Experience Preview Error:", error);
      const message = await getOfferLetterApiErrorMessage(
        error,
        "Unable to preview the selected experience letter.",
        "experience letter"
      );

      setPreviewExperienceLetterError(message);
      setPreviewExperienceLetterLoading(false);
      toast.error(message);
    }
  };

  const closeSendExperienceLetterModal = () => {
    setSendExperienceLetterOpen(false);
    setSendExperienceLetterTarget(null);
    setSendExperienceLetterSubject("");
    setSendExperienceLetterBody("");
    setSendExperienceLetterErrors({});
  };

  const handleOpenSendExperienceLetterModal = (experienceLetter) => {
    if (sendRequestLockRef.current) {
      return;
    }

    const experienceLetterId = getExperienceLetterId(experienceLetter);

    if (!experienceLetterId) {
      toast.error("Unable to send this experience letter.");
      return;
    }

    const draft = buildExperienceLetterEmailDraft(experienceLetter);

    setSendExperienceLetterTarget(experienceLetter);
    setSendExperienceLetterSubject(draft.subject);
    setSendExperienceLetterBody(draft.body);
    setSendExperienceLetterErrors({});
    setSendExperienceLetterOpen(true);
  };

  const handleSendExperienceLetterSubjectChange = (value) => {
    setSendExperienceLetterSubject(value);
    setSendExperienceLetterErrors((prev) =>
      prev.subject ? { ...prev, subject: "" } : prev
    );
  };

  const handleSendExperienceLetterBodyChange = (value) => {
    setSendExperienceLetterBody(value);
    setSendExperienceLetterErrors((prev) =>
      prev.body ? { ...prev, body: "" } : prev
    );
  };

  const handleSendExperienceLetterSubmit = async (event) => {
    event.preventDefault();

    if (!sendExperienceLetterTarget) {
      return;
    }

    const subject = sendExperienceLetterSubject.trim();
    const body = sendExperienceLetterBody.trim();
    const nextErrors = {};

    if (!subject) {
      nextErrors.subject = "Subject is required.";
    }

    if (!body) {
      nextErrors.body = "Body is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setSendExperienceLetterErrors(nextErrors);
      return;
    }

    const experienceLetterId = Number(
      getExperienceLetterId(sendExperienceLetterTarget)
    );

    if (!experienceLetterId) {
      toast.error("Unable to send this experience letter.");
      return;
    }

    if (sendRequestLockRef.current) {
      return;
    }

    sendRequestLockRef.current = true;
    setSendingExperienceLetterId(String(experienceLetterId));

    try {
      await sendExperienceLetter({
        experienceLetterId,
        subject,
        body,
      });

      toast.success("Experience letter sent successfully.");
      closeSendExperienceLetterModal();
      await loadExperienceLetters();
    } catch (error) {
      const message = await getOfferLetterApiErrorMessage(
        error,
        "Unable to send experience letter.",
        "experience letter"
      );

      toast.error(message);
    } finally {
      setSendingExperienceLetterId(null);
      sendRequestLockRef.current = false;
    }
  };

  const closeDeleteExperienceLetterModal = () => {
    if (deletingExperienceLetterId) {
      return;
    }

    setDeleteExperienceLetterTarget(null);
  };

  const handleOpenDeleteExperienceLetter = (experienceLetter) => {
    const experienceLetterId = getExperienceLetterId(experienceLetter);

    if (!experienceLetterId) {
      toast.error("Unable to delete this experience letter.");
      return;
    }

    setDeleteExperienceLetterTarget(experienceLetter);
  };

  const handleDeleteExperienceLetter = async () => {
    if (!deleteExperienceLetterTarget) {
      return;
    }

    const experienceLetterId = getExperienceLetterId(deleteExperienceLetterTarget);

    if (!experienceLetterId) {
      toast.error("Unable to delete this experience letter.");
      return;
    }

    setDeletingExperienceLetterId(String(experienceLetterId));

    try {
      await deleteExperienceLetter(experienceLetterId);

      toast.success("Experience letter deleted successfully.");
      setGeneratedExperienceLetters((prev) =>
        prev.filter(
          (letter) =>
            String(getExperienceLetterId(letter)) !== String(experienceLetterId)
        )
      );
      setDeleteExperienceLetterTarget(null);
      await loadExperienceLetters();
    } catch (error) {
      const message = await getOfferLetterApiErrorMessage(
        error,
        "Unable to delete experience letter.",
        "experience letter"
      );
      toast.error(message);
    } finally {
      setDeletingExperienceLetterId(null);
    }
  };

  return (
    <>
      <div className="offer-card">
        <h3>Generate New Experience Letter</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>
              <FaUser /> Employee
            </label>

            <CompactSearchableDropdown
              value={experienceForm.employeeId}
              onChange={handleExperienceEmployeeChange}
              groups={employeeDropdownGroups}
              placeholder={employeesLoading ? "Loading employees..." : "Select Employee"}
              searchPlaceholder="Search employee ID or name"
              emptyText="No employees found"
              disabled={employeesLoading}
              loading={employeesLoading}
              menuMaxHeight={240}
            />

            {experienceErrors.employeeId && (
              <p className="field-error">{experienceErrors.employeeId}</p>
            )}
          </div>

          <div className="form-group">
            <label>
              <FaBriefcase /> Title
            </label>

            <select
              name="title"
              value={experienceForm.title}
              onChange={handleExperienceChange}
            >
              <option value="">Select Title</option>
              {EXPERIENCE_TITLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {experienceErrors.title && (
              <p className="field-error">{experienceErrors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label>Designation</label>

            <input
              type="text"
              name="designation"
              value={experienceForm.designation}
              onChange={handleExperienceChange}
              placeholder="Enter designation"
            />
            {experienceErrors.designation && (
              <p className="field-error">{experienceErrors.designation}</p>
            )}
          </div>

          <div className="form-group">
            <label>Department</label>

            <input
              type="text"
              name="department"
              value={experienceForm.department}
              onChange={handleExperienceChange}
              placeholder="Enter department"
            />
            {experienceErrors.department && (
              <p className="field-error">{experienceErrors.department}</p>
            )}
          </div>

          <div className="form-group">
            <label>
              <FaCalendarAlt /> End Date
            </label>

            <AppDatePicker
              name="endDate"
              value={experienceForm.endDate}
              onChange={handleExperienceChange}
            />
            {experienceErrors.endDate && (
              <p className="field-error">{experienceErrors.endDate}</p>
            )}
          </div>

          <div className="form-group">
            <label>Authorized Signatory</label>

            <input
              type="text"
              name="authorizedSignatory"
              value={experienceForm.authorizedSignatory}
              onChange={handleExperienceChange}
            />
            {experienceErrors.authorizedSignatory && (
              <p className="field-error">
                {experienceErrors.authorizedSignatory}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Authorized Signatory Designation</label>

            <input
              type="text"
              name="authorizedSignatoryDesignation"
              value={experienceForm.authorizedSignatoryDesignation}
              onChange={handleExperienceChange}
            />
            {experienceErrors.authorizedSignatoryDesignation && (
              <p className="field-error">
                {experienceErrors.authorizedSignatoryDesignation}
              </p>
            )}
          </div>
        </div>

        <div className="offer-buttons">
          <button
            className="btn-primary"
            onClick={handleGenerateExperienceLetter}
            disabled={experienceLoading}
          >
            <FaFileAlt />
            {experienceLoading ? " Generating..." : " Generate Letter"}
          </button>
        </div>
      </div>

      <div className="offer-list">
        <h3>
          <FaFileAlt /> Generated Experience Letters
        </h3>

        <div className="table-scroll">
          <table className="generated-relieving-letters-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>
                  <FaUser /> Employee ID
                </th>
                <th>
                  <FaUser /> Employee Name
                </th>
                <th>Designation</th>
                <th>Department</th>
                <th>
                  <FaCalendarAlt /> End Date
                </th>
                <th>Status</th>
                <th className="offer-actions-cell offer-actions-header">
                  <span className="offer-actions-header-content">
                    <FaFileAlt aria-hidden="true" />
                    <span>Actions</span>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {loadingExperienceLetters ? (
                <tr>
                  <td colSpan="8" className="app-table-empty-cell">
                    Loading experience letters...
                  </td>
                </tr>
              ) : generatedExperienceLetters.length > 0 ? (
                generatedExperienceLetters.map((item, index) => {
                  const employeeId = getExperienceLetterEmployeeId(item);
                  const experienceLetterId = getExperienceLetterId(item);
                  const isSending =
                    String(sendingExperienceLetterId) ===
                    String(experienceLetterId);

                  return (
                    <tr key={experienceLetterId || `${employeeId}-${index}`}>
                      <td>{formatExperienceTableValue(item.id)}</td>
                      <td>{formatExperienceTableValue(item.employeeId)}</td>
                      <td>{formatExperienceTableValue(item.employeeName)}</td>
                      <td>{formatExperienceTableValue(item.designation)}</td>
                      <td>{formatExperienceTableValue(item.department)}</td>
                      <td>{formatDate(item.endDate)}</td>
                      <td>{formatExperienceTableValue(getExperienceLetterStatus(item))}</td>
                      <td className="offer-actions-cell">
                        <div className="offer-actions-wrapper">
                          <button
                            type="button"
                            className="offer-action-btn offer-action-preview"
                            onClick={() => handlePreviewExperienceLetter(item)}
                            disabled={
                              !experienceLetterId ||
                              isSending ||
                              (previewExperienceLetterLoading &&
                                String(
                                  getExperienceLetterId(
                                    previewExperienceLetterTarget
                                  )
                                ) === String(experienceLetterId))
                            }
                            title="Preview"
                            aria-label="Preview experience letter"
                          >
                            <FaEye />
                          </button>

                          <DocumentSendStatusButton
                            status={String(getExperienceLetterStatus(item)).toLowerCase()}
                            loading={false}
                            disabled={!experienceLetterId || isSending}
                            onClick={() => handleOpenSendExperienceLetterModal(item)}
                            title="Send Experience Letter"
                            aria-label="Send experience letter"
                            className="offer-action-btn--status"
                          />

                          <button
                            type="button"
                            className="offer-action-btn offer-action-download"
                            onClick={() =>
                              handleDownloadExperienceLetter(experienceLetterId)
                            }
                            disabled={
                              !experienceLetterId ||
                              isSending ||
                              String(experienceDownloadingId) ===
                                String(experienceLetterId)
                            }
                            title="Download"
                            aria-label="Download experience letter"
                          >
                            <FaDownload />
                          </button>

                          <button
                            type="button"
                            className="offer-action-btn offer-action-delete"
                            onClick={() => handleOpenDeleteExperienceLetter(item)}
                            disabled={
                              !experienceLetterId ||
                              isSending ||
                              String(deletingExperienceLetterId) ===
                                String(experienceLetterId)
                            }
                            title="Delete"
                            aria-label="Delete experience letter"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="app-table-empty-cell">
                    No experience letters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OfferLetterPreviewModal
        open={Boolean(previewExperienceLetterTarget)}
        offerLetter={previewExperienceLetterTarget}
        letterLabel="Experience Letter"
        loading={previewExperienceLetterLoading}
        error={previewExperienceLetterError}
        blob={previewExperienceLetterBlob}
        contentType={previewExperienceLetterContentType}
        onClose={closePreviewExperienceLetterModal}
      />

      <OfferLetterSendModal
        open={sendExperienceLetterOpen}
        offerLetter={sendExperienceLetterTarget}
        letterLabel="Experience Letter"
        recipientName={getExperienceLetterRecipientName(sendExperienceLetterTarget)}
        recipientEmail={getExperienceLetterRecipientEmail(sendExperienceLetterTarget)}
        subject={sendExperienceLetterSubject}
        body={sendExperienceLetterBody}
        errors={sendExperienceLetterErrors}
        sending={Boolean(sendingExperienceLetterId)}
        onClose={closeSendExperienceLetterModal}
        onSubjectChange={handleSendExperienceLetterSubjectChange}
        onBodyChange={handleSendExperienceLetterBodyChange}
        onSubmit={handleSendExperienceLetterSubmit}
      />

      <OfferLetterDeleteModal
        open={Boolean(deleteExperienceLetterTarget)}
        offerLetter={deleteExperienceLetterTarget}
        letterLabel="Experience Letter"
        message="Are you sure you want to delete this experience letter?"
        deleting={Boolean(deletingExperienceLetterId)}
        onClose={closeDeleteExperienceLetterModal}
        onConfirm={handleDeleteExperienceLetter}
      />
    </>
  );
}

export default ExperienceLetterSection;
