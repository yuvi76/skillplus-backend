import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ErrorHandlerService } from '../util/error-handler.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async sendEmail(to: string, subject: string, ejsHtml: string): Promise<any> {
    try {
      const transporter = await nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST'),
        port: this.configService.get<number>('EMAIL_PORT'),
        secure: this.configService.get<boolean>('EMAIL_SECURE'),
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASSWORD'),
        },
      });

      const mailOptions = {
        from: this.configService.get<string>('EMAIL_FROM'),
        to,
        subject,
        html: ejsHtml,
      };

      return await transporter.sendMail(mailOptions);
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
