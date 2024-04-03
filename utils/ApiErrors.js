class ApiError extends Error {
  constructor(
    statusCode,
    errors = [],
    stake = "",
    message = "something went wrong",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stake) {
      this.stack = stake;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
