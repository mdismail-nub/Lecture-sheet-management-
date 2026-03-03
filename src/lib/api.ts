import { Course, Material, Announcement, SearchResults } from "../types";

const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Request failed");
  }
  return res.json();
};

export const api = {
  auth: {
    login: (credentials: any) => fetcher("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }),
    logout: () => fetcher("/api/auth/logout", { method: "POST" }),
    me: () => fetcher("/api/auth/me"),
  },
  courses: {
    getAll: (): Promise<Course[]> => fetcher("/api/courses"),
    getById: (id: string | number): Promise<Course> => fetcher(`/api/courses/${id}`),
    create: (data: Partial<Course>) => fetcher("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    update: (id: number, data: Partial<Course>) => fetcher(`/api/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetcher(`/api/courses/${id}`, { method: "DELETE" }),
    getMaterials: (id: string | number): Promise<Material[]> => fetcher(`/api/courses/${id}/materials`),
  },
  materials: {
    getAll: (): Promise<Material[]> => fetcher("/api/materials"),
    create: (data: Partial<Material>) => fetcher("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    update: (id: number, data: Partial<Material>) => fetcher(`/api/materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetcher(`/api/materials/${id}`, { method: "DELETE" }),
  },
  announcements: {
    getAll: (): Promise<Announcement[]> => fetcher("/api/announcements"),
    create: (data: Partial<Announcement>) => fetcher("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    update: (id: number, data: Partial<Announcement>) => fetcher(`/api/announcements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetcher(`/api/announcements/${id}`, { method: "DELETE" }),
  },
  search: {
    query: (q: string): Promise<SearchResults> => fetcher(`/api/search?q=${encodeURIComponent(q)}`),
  },
};
