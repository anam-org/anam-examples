import { ErrorInfo } from "react";
import { ErrorBase } from "./types";
import { logger } from "./logger";

export const errorHandler = (
  error: unknown,
  context: string = "",
  errorInfo: ErrorInfo | null = null,
) => {
  if (typeof error === "object" && error !== null && "message" in error) {
    const typedError = error as ErrorBase & {
      code?: number;
      status?: number;
      errors?: string[];
      operation?: string;
      logLevel?: "trace" | "debug" | "info" | "warn" | "error";
    };

    let errorCode = typedError.code ? `[${typedError.code}] ` : "";
    errorCode = typedError.status ? `[HTTP ${typedError.status}] ` : errorCode;

    const errorMessage =
      typedError.message || "An unexpected error occurred. Please try again.";

    const detailedErrors = typedError.errors
      ? `Errors: ${typedError.errors.join(", ")}`
      : "";

    const operation = typedError.operation
      ? `Operation: ${typedError.operation}`
      : "";

    const logMessage = `${errorCode}Error: ${errorMessage} Context: ${context} ${detailedErrors} ${operation} Error Info: ${
      errorInfo ? errorInfo.componentStack : "No Error Info"
    }`;

    switch (typedError.logLevel) {
      case "trace":
        logger.trace(logMessage);
        break;
      case "debug":
        logger.debug(logMessage);
        break;
      case "info":
        logger.info(logMessage);
        break;
      case "warn":
        logger.warn(logMessage);
        break;
      case "error":
        logger.error(logMessage);
        break;
      default:
        logger.error(logMessage);
    }
  } else {
    logger.error(`Unhandled error: ${error}. Context: ${context}`);
  }
};
