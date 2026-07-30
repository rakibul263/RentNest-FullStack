import {
  ApiError,
  ApiResponse,
  AuthResponse,
  Category,
  AdminUser,
  PaginationMeta,
  Payment,
  Property,
  PropertyFilters,
  RentalRequest,
  Review,
  User,
  PlatformStats,
} from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export const TOKEN_KEY = "rn_token";
export const USER_KEY = "rn_user";

let cachedToken: string | null = null;

export const getToken = () => cachedToken;
export const setToken = (t: string | null) => {
  cachedToken = t;
};

export const persistSession = (user: User, token: string) => {
  setToken(token);
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    document.cookie = `rn_token=${token}; path=/; max-age=604800; samesite=lax`;
  }
};

export const clearSession = () => {
  setToken(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = "rn_token=; path=/; max-age=0; samesite=lax";
  }
};

export const readStoredSession = (): {
  token: string | null;
  user: User | null;
} => {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(USER_KEY);
  setToken(token);
  return { token, user: raw ? (JSON.parse(raw) as User) : null };
};

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = cachedToken || getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { ...headers, ...(options.headers as Record<string, string>) },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Network error. Please check your connection and try again.",
      0
    );
  }

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(`Request failed (${res.status})`, res.status);
  }

  if (!res.ok || json.success === false) {
    const message = json.message || "Something went wrong";
    const err = new ApiError(message, res.status, json);
    if (res.status === 401) {
      clearSession();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("rn:unauthorized"));
      }
    }
    throw err;
  }

  return json;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ===== Auth =====
export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: "tenant" | "landlord";
    phone?: string;
  }) => api.post<AuthResponse>("/auth/register", payload),
  login: (payload: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", payload),
  me: () => api.get<User>("/auth/me"),
};

// ===== Public =====
export const propertyApi = {
  list: (filters: PropertyFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return api.get<Property[]>(`/properties${qs ? `?${qs}` : ""}`);
  },
  byId: (id: string) => api.get<Property>(`/properties/${id}`),
  stats: () => api.get<PlatformStats>("/properties/stats"),
};

export const categoryApi = {
  list: () => api.get<Category[]>("/categories"),
};

export const reviewApi = {
  forProperty: (propertyId: string) =>
    api.get<Review[]>(`/reviews?propertyId=${propertyId}`),
  create: (payload: {
    propertyId: string;
    rentalRequestId: string;
    rating: number;
    comment?: string;
  }) => api.post<Review>("/reviews", payload),
  my: () => api.get<Review[]>("/reviews/my"),
};

// ===== Rentals =====
export const rentalApi = {
  create: (payload: {
    propertyId: string;
    startDate: string;
    endDate: string;
    message?: string;
  }) => api.post<RentalRequest>("/rentals", payload),
  my: () => api.get<RentalRequest[]>("/rentals"),
  byId: (id: string) => api.get<RentalRequest>(`/rentals/${id}`),
};

// ===== Payments =====
export const paymentApi = {
  createIntent: (rentalRequestId: string) =>
    api.post<{
      clientSecret: string;
      paymentId: string;
      transactionId: string;
      amount: number;
    }>("/payments/create-payment-intent", { rentalRequestId }),
  confirm: (paymentId: string, transactionId: string) =>
    api.post<Payment>("/payments/confirm", { paymentId, transactionId }),
  history: () => api.get<Payment[]>("/payments"),
  byId: (id: string) => api.get<Payment>(`/payments/${id}`),
};

// ===== Landlord =====
export const landlordApi = {
  properties: () => api.get<Property[]>("/landlord/properties"),
  createProperty: (payload: Record<string, unknown>) =>
    api.post<Property>("/landlord/properties", payload),
  updateProperty: (id: string, payload: Record<string, unknown>) =>
    api.put<Property>(`/landlord/properties/${id}`, payload),
  deleteProperty: (id: string) =>
    api.delete<null>(`/landlord/properties/${id}`),
  requests: () => api.get<RentalRequest[]>("/landlord/requests"),
  updateRequestStatus: (id: string, status: "approved" | "rejected") =>
    api.patch<RentalRequest>(`/landlord/requests/${id}`, { status }),
};

// ===== Admin =====
export const adminApi = {
  users: (page = 1, limit = 20) =>
    api.get<AdminUser[]>(`/admin/users?page=${page}&limit=${limit}`),
  updateUserStatus: (id: string, isBanned: boolean) =>
    api.patch<{ id: string; isBanned: boolean }>(`/admin/users/${id}`, {
      isBanned,
    }),
  properties: (page = 1, limit = 20) =>
    api.get<Property[]>(`/admin/properties?page=${page}&limit=${limit}`),
  rentals: (page = 1, limit = 20) =>
    api.get<RentalRequest[]>(`/admin/rentals?page=${page}&limit=${limit}`),
  createCategory: (payload: { name: string; description?: string }) =>
    api.post<Category>("/admin/categories", payload),
  deleteCategory: (id: string) =>
    api.delete<null>(`/admin/categories/${id}`),
};

export type { ApiResponse, PaginationMeta };
