import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async sendForgotPasswordEmail(toEmail: string, token: string) {
    try {
      const url = `${this.configService.get(
        'CORS_ORIGIN',
      )}/reset-password/?token=${token}`;

      await this.mailerService.sendMail({
        to: toEmail,
        from: `"Vaccine Portal Support" <${this.configService.get('MAIL_FROM')}>`,
        subject: 'Reset password request',
        template: './forgot-password',
        context: { url: url },
      });
    } catch (error) {
      throw new InternalServerErrorException({
        error: error,
      });
    }
  }
}