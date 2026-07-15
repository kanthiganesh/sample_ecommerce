export class HttpException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    errors: any;

    constructor(message:string, errorCode: ErrorCode, statusCode: number, errors: any) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export default HttpException;

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSABLE_ENTITY = 1004,
    INTERNAL_SERVER_ERROR = 1005,
    PRODUCT_NOT_FOUND = 1006,
    UNAUTHORIZED = 1006,
    ADDRESS_NOT_FOUND = 1007,
    ADDRESS_DOES_NOT_BELONGS = 1008,
    ORDER_NOT_FOUND=1009
}