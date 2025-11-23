import axios from "axios";
import { getSession } from "next-auth/react";
import type { ApiResponse, Service, Project, Order, User, ProjectImage } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session && (session as any).accessToken) {
    config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
  }
  return config;
});

const logFallbackNotice = (message?: string, meta?: Record<string, any>) => {
  if (meta?.fallback) {
    console.warn(message || "Fallback data served. Configure the database to load live content.");
  }
};

// Services
export const getServices = async (): Promise<Service[]> => {
  const { data } = await api.get<ApiResponse<Service[]>>("/services");
  logFallbackNotice(data.message, data.meta);
  return data.data || [];
};

export const getService = async (slug: string): Promise<Service> => {
  const { data } = await api.get<ApiResponse<Service>>(`/services/${slug}`);
  logFallbackNotice(data.message, data.meta);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const getServiceById = async (id: string): Promise<Service> => {
  const { data } = await api.get<ApiResponse<Service>>(`/services/${id}`);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const createService = async (payload: Partial<Service>): Promise<Service> => {
  const { data } = await api.post<ApiResponse<Service>>("/services", payload);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const updateService = async (id: string, payload: Partial<Service>): Promise<Service> => {
  const { data } = await api.put<ApiResponse<Service>>(`/services/${id}`, payload);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const deleteService = async (id: string): Promise<void> => {
  const { data } = await api.delete<ApiResponse>(`/services/${id}`);
  if (!data.success) throw new Error(data.message);
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<ApiResponse<Project[]>>("/projects");
  logFallbackNotice(data.message, data.meta);
  return data.data || [];
};

export const getProject = async (id: string): Promise<Project> => {
  const { data } = await api.get<ApiResponse<Project>>(`/projects/${id}`);
  logFallbackNotice(data.message, data.meta);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const createProject = async (payload: Partial<Project>): Promise<Project> => {
  const { data } = await api.post<ApiResponse<Project>>("/projects", payload);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const updateProject = async (id: string, payload: Partial<Project>): Promise<Project> => {
  const { data } = await api.put<ApiResponse<Project>>(`/projects/${id}`, payload);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { data } = await api.delete<ApiResponse>(`/projects/${id}`);
  if (!data.success) throw new Error(data.message);
};

// Project Images
export const getProjectImages = async (projectId: string): Promise<ProjectImage[]> => {
  const { data } = await api.get<ApiResponse<ProjectImage[]>>(`/project-images?projectId=${projectId}`);
  return data.data || [];
};

export const createProjectImage = async (payload: { projectId: string; imageUrl: string }): Promise<ProjectImage> => {
  const { data } = await api.post<ApiResponse<ProjectImage>>("/project-images", payload);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const deleteProjectImage = async (id: string): Promise<void> => {
  const { data } = await api.delete<ApiResponse>(`/project-images/${id}`);
  if (!data.success) throw new Error(data.message);
};

// Orders
export const getOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<ApiResponse<Order[]>>("/orders");
  return data.data || [];
};

export const getOrder = async (id: string): Promise<Order> => {
  const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const createOrder = async (payload: Partial<Order>): Promise<Order> => {
  const { data } = await api.post<ApiResponse<Order>>("/orders", payload);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const updateOrder = async (id: string, payload: { status: Order["status"] }): Promise<Order> => {
  const { data } = await api.put<ApiResponse<Order>>(`/orders/${id}`, payload);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  const { data } = await api.delete<ApiResponse>(`/orders/${id}`);
  if (!data.success) throw new Error(data.message);
};

// Users
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<ApiResponse<User[]>>("/users");
  return data.data || [];
};

export const updateUser = async (id: string, payload: Partial<User>): Promise<User> => {
  const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, payload);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  const { data } = await api.delete<ApiResponse>(`/users/${id}`);
  if (!data.success) throw new Error(data.message);
};

// Content
export const getContent = async (): Promise<any> => {
  const { data } = await api.get<ApiResponse<any>>("/content");
  return data.data || null;
};

// Contact
export const sendContactMessage = async (payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> => {
  const { data } = await api.post<ApiResponse>("/contact", payload);
  if (!data.success) throw new Error(data.message);
};

export default api;

