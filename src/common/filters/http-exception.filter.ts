import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ProductNotFoundException,
  InvalidProductDataException,
} from '../../modules/product/domain/exceptions/product.exceptions';
import {
  InvalidEmailException,
  InvalidLoginCredentialsException,
  UserNotFoundException,
  WeakPasswordException,
} from 'src/modules/user/domain/exceptions/user.exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (
      exception instanceof ProductNotFoundException ||
      exception instanceof UserNotFoundException
    ) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (
      exception instanceof InvalidEmailException ||
      exception instanceof WeakPasswordException ||
      exception instanceof InvalidProductDataException ||
      exception instanceof InvalidLoginCredentialsException
    ) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
