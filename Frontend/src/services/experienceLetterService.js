import api from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import { withAuthHeaders } from "../api/requestConfig";

export const generateExperienceLetter = (data, config = {}) =>
  api.post(
    API_ENDPOINTS.experienceLetters.generate,
    data,
    withAuthHeaders(config)
  );

export const getAllExperienceLetters = (config = {}) =>
  api.get(
    API_ENDPOINTS.experienceLetters.all,
    withAuthHeaders(config)
  );

export const downloadExperienceLetter = (id, config = {}) =>
  api.get(
    API_ENDPOINTS.experienceLetters.download(id),
    {
      ...withAuthHeaders(config),
      responseType: "blob",
    }
  );

export const previewExperienceLetter = (id, config = {}) =>
  api.get(
    API_ENDPOINTS.experienceLetters.preview(id),
    {
      ...withAuthHeaders(config),
      responseType: "blob",
      dedupe: false,
    }
  );

export const sendExperienceLetter = (payload, config = {}) =>
  api.post(
    API_ENDPOINTS.experienceLetters.send,
    payload,
    withAuthHeaders(config)
  );

export const deleteExperienceLetter = (id, config = {}) =>
  api.delete(
    API_ENDPOINTS.experienceLetters.delete(id),
    withAuthHeaders(config)
  );
