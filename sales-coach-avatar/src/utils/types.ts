class ErrorBase extends Error {
  readonly cause?: Error;
  readonly logLevel: "trace" | "debug" | "info" | "warn" | "error";

  constructor(
    message?: string,
    cause?: Error | unknown,
    logLevel: "info" | "warn" | "error" = "error",
  ) {
    super(message);
    this.cause = cause instanceof Error ? cause : undefined;
    this.logLevel = logLevel;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class FetchError extends ErrorBase {
  name!: "FetchError";
  status!: number;

  constructor(message: string, status: number, cause?: Error) {
    super(message, cause, "error");
    this.status = status;
  }
}

const clientUnavailableError: ErrorBase & {
  code: number;
  operation: string;
} = {
  message: "Client is not available. Please try again later.",
  code: 500,
  operation: "Stream Initialization",
  logLevel: "error",
  name: "ClientUnavailableError",
};

export { ErrorBase, FetchError, clientUnavailableError };
