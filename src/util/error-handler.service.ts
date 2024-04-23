import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorHandlerService {
  async HttpException(error: any) {
    throw new HttpException(
      error.message,
      error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
