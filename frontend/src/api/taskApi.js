import api from "./axiosInstance";

/**
 * Task API helpers
 */

export const fetchTasks = () => api.get("/tasks");

export const fetchTaskById = (id) => api.get(`/tasks/${id}`);

export const createTask = (data) => api.post("/tasks", data);

export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

export const deleteTask = (id) => api.delete(`/tasks/${id}`);
