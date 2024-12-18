import { ErrorInfo } from "react";
import { logger } from "./logger";
import { ErrorBase } from "./types";

/**
 * Handles errors by logging them with an appropriate log level based on error type,
 * and provides additional context and error information if available.
 */
export const errorHandler = (
  error: unknown,
  context: string = "",
  errorInfo: ErrorInfo | null = null,
) => {
  // Check if the error object contains a message property
  if (typeof error === "object" && error !== null && "message" in error) {
    const typedError = error as ErrorBase & {
      code?: number;
      status?: number;
      errors?: string[];
      operation?: string;
      logLevel?: "trace" | "debug" | "info" | "warn" | "error";
    };

    // Extract error code from `code` or `status`, default to empty string
    let errorCode = typedError.code ? `[${typedError.code}] ` : "";
    errorCode = typedError.status ? `[HTTP ${typedError.status}] ` : errorCode;

    // Extract the error message, or use a default message
    const errorMessage =
      typedError.message || "An unexpected error occurred. Please try again.";

    // Collect any detailed error messages if present
    const detailedErrors = typedError.errors
      ? `Errors: ${typedError.errors.join(", ")}`
      : "";

    // Collect the operation name if available
    const operation = typedError.operation
      ? `Operation: ${typedError.operation}`
      : "";

    // Construct the log message with available information
    const logMessage = `${errorCode}Error: ${errorMessage} Context: ${context} ${detailedErrors} ${operation} Error Info: ${
      errorInfo ? errorInfo.componentStack : "No Error Info"
    }`;

    // Log the error based on its severity level
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
    // If error is not an object with a message, log it as an unhandled error
    logger.error(`Unhandled error: ${error}. Context: ${context}`);
  }
};
