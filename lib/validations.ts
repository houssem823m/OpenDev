import { z } from "zod";

// Service validations
export const createServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
});

export const updateServiceSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  image: z.string().optional(),
  slug: z.string().min(1, "Slug is required").optional(),
});

// Project validations
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  mainImage: z.string().optional(),
  externalLink: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  category: z.string().min(1, "Category is required").optional(),
  description: z.string().optional(),
  mainImage: z.string().optional(),
  externalLink: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// ProjectImage validations
export const createProjectImageSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  imageUrl: z.string().url("Invalid image URL").min(1, "Image URL is required"),
});

// Order validations
export const createOrderSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  fileUrl: z.string().url("Invalid file URL").optional().or(z.literal("")),
});

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "in_progress", "done", "cancelled"]),
});

// User validations
export const updateUserSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  isBanned: z.boolean().optional(),
});

