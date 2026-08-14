import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";

type ErrorResponse = {
  error: string;
  message: unknown;
  path: string;
  statusCode: number;
  timestamp: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    if (!(exception instanceof HttpException)) {
      this.logger.error(exception);
    }

    const body: ErrorResponse = {
      error: status >= 500 ? "Internal Server Error" : "Request Error",
      message: exceptionResponse,
      path: request.url,
      statusCode: status,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }
}
