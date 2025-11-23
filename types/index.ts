// Global type definitions

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  isBanned: boolean;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  createdAt: Date;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  image?: string;
  slug: string;
  isArchived: boolean;
  createdAt: Date;
}

export interface Project {
  _id: string;
  title: string;
  category: string;
  description?: string;
  mainImage?: string;
  externalLink?: string;
  isArchived: boolean;
  createdAt: Date;
}

export interface ProjectImage {
  _id: string;
  projectId: string | Project;
  imageUrl: string;
}

export interface Order {
  _id: string;
  serviceId: string | Service;
  name: string;
  email: string;
  message: string;
  fileUrl?: string;
  status: "pending" | "in_progress" | "done" | "cancelled";
  createdAt: Date;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: any[];
  meta?: Record<string, any>;
}

