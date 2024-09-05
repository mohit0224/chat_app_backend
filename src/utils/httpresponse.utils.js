export class apiResponse {
    constructor(statusCode, message = "Success", data) {
        this.message = message;
        this.status = statusCode;
        this.success = statusCode < 400;
        this.data = data;
    }
}

export class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.message = message;
        this.status = statusCode;
        this.success = false;
        this.data = null;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
