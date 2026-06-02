export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly errorCode?: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, errorCode?: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errorCode = errorCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Solicitud incorrecta", errorCode?: string, details?: unknown) {
    super(message, 400, errorCode || "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "No autorizado", errorCode?: string) {
    super(message, 401, errorCode || "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso denegado", errorCode?: string) {
    super(message, 403, errorCode || "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado", errorCode?: string) {
    super(message, 404, errorCode || "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflicto en la solicitud", errorCode?: string) {
    super(message, 409, errorCode || "CONFLICT");
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Error interno del servidor", errorCode?: string) {
    super(message, 500, errorCode || "INTERNAL_SERVER_ERROR");
  }
}
