// A small custom error class so services can throw errors with an intended
// HTTP status code attached. The error middleware checks for this class to
// decide between a 4xx (expected, client-facing) and 500 (unexpected) response.
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
