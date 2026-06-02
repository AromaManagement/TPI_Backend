export interface ApiErrorResponse {
  status: string;
  errorCode: string;
  message: string;
  stack?: string;
  error?: unknown;
  details?: unknown;
}
