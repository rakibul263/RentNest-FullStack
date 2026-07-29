import { Request } from 'express';

export enum UserRole {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  ADMIN = 'admin',
}

export enum RentalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PaymentProvider {
  STRIPE = 'stripe',
  SSLCOMMERZ = 'sslcommerz',
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorDetails?: any;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}
