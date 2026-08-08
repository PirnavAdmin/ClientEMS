const API_ORIGIN = (
    import.meta.env.VITE_API_ORIGIN ||
    "http://43.205.32.3:3000"
).replace(/\/+$/, "");
 
export const SERVER_URL = API_ORIGIN;
export const BASE_URL = `${API_ORIGIN}/api`;
 
 
 
 
