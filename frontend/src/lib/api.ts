const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
  upload: async (file: File) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const formData = new FormData();
    formData.append("file", file);
    const headers: HeadersInit = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json() as Promise<{ url: string }>;
  },
};
