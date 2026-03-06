import api from "./axiosInstance";

/**
 * Auth API helpers — wraps the raw axios calls.
 */

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const getMe = () => api.get("/auth/me");
