import { API_ENDPOINTS } from "../../api/endpoints";

const text = (name, label, options = {}) => ({ name, label, type: "text", ...options });
const file = (name, label, options = {}) => ({ name, label, type: "file", ...options });

export const templateModulesConfig = {
  templates: {
    title: "Templates",
    category: "Document & Template Management",
    moduleName: "Templates",
    description: "Upload, view, download, and delete document templates.",
    api: {
      list: API_ENDPOINTS.template.list,
      create: API_ENDPOINTS.template.create,
      delete: API_ENDPOINTS.template.delete,
      contentType: "multipart/form-data",
    },
    idKey: "id",
    columns: [
      { key: "templateName", label: "Template Name" },
      { key: "code", label: "Code" },
      { key: "category", label: "Category" },
      { key: "version", label: "Version" },
      { key: "company", label: "Company" },
    ],
    formFields: [
      text("templateName", "Template Name", { required: true }),
      text("code", "Code", { required: true }),
      text("category", "Category", { required: true }),
      text("version", "Version"),
      text("company", "Company"),
      file("file", "Template File", { required: true }),
    ],
    uploadSettings: {
      fileField: "file",
      accept: ".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg",
      maxSizeMb: 10,
    },
    searchFields: ["templateName", "code", "category", "version", "company"],
    workflowButtons: [
      {
        key: "download",
        label: "Download",
        method: "download",
        endpoint: API_ENDPOINTS.template.download,
        permission: "download",
      },
    ],
  },
};

export const templateModuleOptions = [{ value: "templates", label: "Templates" }];
