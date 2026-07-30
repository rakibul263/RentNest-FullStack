export type UserRole = "tenant" | "landlord" | "admin";

export type RentalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "completed" | "failed";

export type PaymentProvider = "stripe" | "sslcommerz";

export interface PlatformStats {
  totalProperties: number;
  totalTenants: number;
  totalLandlords: number;
  totalRentals: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  isBanned: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface LandlordLite {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  tenantId: string;
  propertyId: string;
  rentalRequestId: string;
  tenant?: { id: string; name: string };
  property?: { id: string; title: string };
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string | null;
  zipCode: string | null;
  lat: number | null;
  lng: number | null;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  landlordId: string;
  categoryId: string;
  landlord?: LandlordLite;
  category?: { id: string; name: string };
  reviews?: Review[];
  _count?: { rentalRequests: number; reviews: number };
}

export interface RentalRequest {
  id: string;
  status: RentalStatus;
  message: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  propertyId: string;
  landlordId: string;
  tenant?: { id: string; name: string; email: string; phone?: string | null };
  landlord?: LandlordLite;
  property?: {
    id: string;
    title: string;
    price: number;
    address?: string;
    city?: string;
    images?: string[];
    category?: { id: string; name: string };
  };
  payments?: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  provider: PaymentProvider;
  transactionId: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  tenantId: string;
  rentalRequestId: string;
  rentalRequest?: {
    id: string;
    property?: {
      id: string;
      title: string;
      price?: number;
      images?: string[];
      address?: string;
    };
    landlord?: LandlordLite;
  };
}

export interface AdminUser extends User {
  _count: { properties: number; rentalRequests: number; reviews: number };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errorDetails?: unknown;
}

export class ApiError extends Error {
  status: number;
  data?: ApiResponse;

  constructor(message: string, status = 500, data?: ApiResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  bedrooms?: number;
  city?: string;
  page?: number;
  limit?: number;
}
