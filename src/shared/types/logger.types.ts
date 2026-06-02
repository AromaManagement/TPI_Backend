export interface LogMetadata {
  timestamp: string;
  level: "ERROR" | "WARN";
  method: string;
  url: string;
  ip?: string;
  message: string;
  statusCode: number;
  errorCode?: string;
  isOperational: boolean;
  stack?: string;
}
