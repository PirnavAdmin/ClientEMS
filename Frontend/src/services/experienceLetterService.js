import api from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import { withAuthHeaders } from "../api/requestConfig";

export const generateExperienceLetter = (data, config = {}) =>
  api.post(
    API_ENDPOINTS.EXPERIENCE_LETTER.GENERATE,
    data,
    withAuthHeaders(config)
  );

export const getAllExperienceLetters = (config = {}) =>
  api.get(API_ENDPOINTS.EXPERIENCE_LETTER.GET_ALL, withAuthHeaders(config));

export const downloadExperienceLetter = (id, config = {}) =>
  api.get(API_ENDPOINTS.EXPERIENCE_LETTER.DOWNLOAD(id), {
    ...withAuthHeaders(config),
    responseType: "blob",
  });

export const previewExperienceLetter = (id, config = {}) =>
  api.get(API_ENDPOINTS.EXPERIENCE_LETTER.PREVIEW(id), {
    ...withAuthHeaders(config),
    responseType: "blob",
    dedupe: false,
  });

export const sendExperienceLetter = (payload, config = {}) =>
  api.post(
    API_ENDPOINTS.EXPERIENCE_LETTER.SEND,
    payload,
    withAuthHeaders(config)
  );

export const deleteExperienceLetter = (id, config = {}) =>
  api.delete(API_ENDPOINTS.EXPERIENCE_LETTER.DELETE(id), withAuthHeaders(config));
