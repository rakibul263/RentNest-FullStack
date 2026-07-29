import { Response } from 'express';
import { ApiResponse } from '../types';

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: { page: number; limit: number; total: number }
) => {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    meta,
  };
  res.status(statusCode).json(response);
};

export default sendResponse;
