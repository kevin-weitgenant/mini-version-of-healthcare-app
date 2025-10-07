import { Request, Response } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export class DatabaseError extends Error {
  statusCode = 500;
  isOperational = true;
  code = 'DATABASE_ERROR';

  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = 'DatabaseError';
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class ValidationError extends Error {
  statusCode = 400;
  isOperational = true;
  code = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  statusCode = 401;
  isOperational = true;
  code = 'AUTHENTICATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  isOperational = true;
  code = 'NOT_FOUND';

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  statusCode = 409;
  isOperational = true;
  code = 'CONFLICT';

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * Sanitizes database errors to prevent sensitive information from leaking to clients
 */
export function sanitizeDatabaseError(error: any): { message: string; statusCode: number } {
  // Log the full error for debugging
  console.error('Database Error Details:', {
    message: error.message,
    code: error.code,
    detail: error.detail,
    hint: error.hint,
    stack: error.stack
  });

  // Check for specific database error types
  if (error.code === '23505') { // Unique constraint violation
    return {
      message: 'A record with this information already exists',
      statusCode: 409
    };
  }
  
  if (error.code === '23503') { // Foreign key constraint violation
    return {
      message: 'Referenced record not found',
      statusCode: 400
    };
  }
  
  if (error.code === '23502') { // Not null constraint violation
    return {
      message: 'Required field is missing',
      statusCode: 400
    };
  }
  
  if (error.code === '42P01') { // Table doesn't exist
    return {
      message: 'Database configuration error',
      statusCode: 500
    };
  }
  
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return {
      message: 'Database connection failed',
      statusCode: 500
    };
  }

  // Check for Drizzle ORM specific errors
  if (error.message && error.message.includes('Failed query:')) {
    return {
      message: 'Database operation failed',
      statusCode: 500
    };
  }

  // Generic database error
  return {
    message: 'Database operation failed',
    statusCode: 500
  };
}

/**
 * Handles and sanitizes any error, returning appropriate response
 */
export function handleError(error: any, req: Request, res: Response): void {
  // Log the full error for debugging
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  let statusCode = 500;
  let message = 'An unexpected error occurred';

  // Handle known error types
  if (error instanceof DatabaseError || 
      error instanceof ValidationError || 
      error instanceof AuthenticationError || 
      error instanceof NotFoundError || 
      error instanceof ConflictError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Handle database errors
  else if (error.message && (
    error.message.includes('Failed query:') ||
    error.message.includes('relation') ||
    error.message.includes('column') ||
    error.message.includes('constraint') ||
    error.code
  )) {
    const sanitized = sanitizeDatabaseError(error);
    statusCode = sanitized.statusCode;
    message = sanitized.message;
  }
  // Handle validation errors
  else if (error.message && error.message.includes('Invalid')) {
    statusCode = 400;
    message = error.message;
  }
  // Handle generic errors
  else if (error instanceof Error) {
    // Only expose safe error messages
    if (error.message.includes('Unauthorized') || error.message.includes('Invalid credentials')) {
      statusCode = 401;
      message = 'Invalid credentials';
    } else if (error.message.includes('not found')) {
      statusCode = 404;
      message = 'Resource not found';
    } else {
      // For any other error, use a generic message
      message = 'An unexpected error occurred';
    }
  }

  res.status(statusCode).json({
    ok: false,
    error: message,
    timestamp: new Date().toISOString()
  });
}

/**
 * Wraps async route handlers to catch errors
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      handleError(error, req, res);
    });
  };
}
