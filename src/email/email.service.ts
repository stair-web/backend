import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as emailTemplate from 'email-templates';
import * as hbs from 'handlebars';
import * as sgMail from '@sendgrid/mail';


import { EmailInfoDto } from './dto/email-info.dto';

import { ContentType, EmailMapping } from './enum/content-type.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private SENDGRID_API_KEY: string;
    private TEMPLATES_PATH: string;
    private LAYOUT_FILE_PATH: string;
    private TMM_LOGO_FILE_PATH: string;
    private email: emailTemplate;
    private FROM_EMAIL: string;
    private FROM_NAME: string;
    private STANDARD_MSG;
    private HEADER_LOGO_ATTACHMENT;
    constructor(
        private configService: ConfigService
        ) {
        this.SENDGRID_API_KEY = configService.get<string>('SENDGRID_API_KEY');
        sgMail.setApiKey(this.SENDGRID_API_KEY);
        
        this.TEMPLATES_PATH = path.join(__dirname, 'templates');
        this.LAYOUT_FILE_PATH = path.join(
          this.TEMPLATES_PATH,
          '_layout',
          'html.hbs',
        );
        this.TMM_LOGO_FILE_PATH = path.join(
          this.TEMPLATES_PATH,
          '_layout',
          'thermomix-logo.png',
        );
        this.FROM_EMAIL = 'bhnhock@gmail.com';
        this.FROM_NAME = 'ari';
        this.STANDARD_MSG = {
          from: {
            name: this.FROM_NAME,
            email: this.FROM_EMAIL,
          },
        };
        this.HEADER_LOGO_ATTACHMENT = {
          content: this.readFileSync(this.TMM_LOGO_FILE_PATH, 'base64'),
          type: ContentType.PNG,
          filename: 'thermomix-logo.png',
          disposition: 'inline',
          content_id: 'tmmLogo',
        };
        this.email = new emailTemplate({
          juice: true,
          juiceResources: {
            preserveImportant: true,
            webResources: {
              relativeTo: this.TEMPLATES_PATH,
            },
          },
        });
      }
      private getPathForEmail = (emailMappingProperty: string) => {
        const subjectPath: string = path.join(
          this.TEMPLATES_PATH,
          EmailMapping[emailMappingProperty].templateFolder,
          'subject.hbs',
        );
        const textPath: string = path.join(
          this.TEMPLATES_PATH,
          EmailMapping[emailMappingProperty].templateFolder,
          'text.hbs',
        );
        const htmlPath: string = path.join(
          this.TEMPLATES_PATH,
          EmailMapping[emailMappingProperty].templateFolder,
          'html.hbs',
        );
        return {
          subjectPath,
          textPath,
          htmlPath,
        };
      };
      async sendResetPasswordEmail(emailInfoDto: EmailInfoDto, originName: string) {
        const { subjectPath, textPath, htmlPath } = this.getPathForEmail(
          'USER_RESET_PASSWORD',
        );
          
        hbs.registerPartial('emailContent', this.readFileSync(htmlPath, 'utf8'));
        const data = {
          title: EmailMapping.USER_RESET_PASSWORD.title,
          name: emailInfoDto.name,
          username: emailInfoDto.username,
          styles: [EmailMapping.USER_RESET_PASSWORD.templateFolder],
          resetPasswordLink: `${originName}/#/auth/confirm-password?token=${emailInfoDto.token}`,
        };
        const subject: string = await this.renderEmailTemplate(subjectPath, data);
        const text: string = await this.renderEmailTemplate(textPath, data);
        const html: string = await this.renderEmailTemplate(
          this.LAYOUT_FILE_PATH,
          data,
        );
        console.log(this.STANDARD_MSG);
        
        const msg = {
          ...this.STANDARD_MSG,
          to: emailInfoDto.email,
          subject,
          text,
          html,
          // attachments: [this.HEADER_LOGO_ATTACHMENT],
        };
        return await this.sendMail(msg);
      }
      private readFileSync(filePath: string, encoding: BufferEncoding) {
        return fs.readFileSync(filePath, { encoding: encoding });
      }
      private async renderEmailTemplate(source: string, data = {}) {
        return await this.email.render(source, data);
      }
      private async sendMail(message) {
        try {
          await sgMail.send(message);
        } catch (error) {
          console.error(error);
    
          if (error.response) {
            console.error(error.response.body);
          }
    
          throw new InternalServerErrorException(
            'Lỗi trong quá trình gửi mail, vui lòng thử lại sau',
          );
        }
    
        return {
          statusCode: 201,
          message: 'Gửi email thành công, vui lòng kiểm tra hộp thư.',
        };
      }
      async sendActiveAccountEmail(emailInfoDto: EmailInfoDto, originName: string) {
        const { subjectPath, textPath, htmlPath } = this.getPathForEmail(
          'USER_ACTIVE_ACCOUNT',
        );
    
        hbs.registerPartial('emailContent', this.readFileSync(htmlPath, 'utf8'));
        const data = {
          title: EmailMapping.USER_ACTIVE_ACCOUNT.title,
          name: emailInfoDto.name,
          username: emailInfoDto.name,
          password:emailInfoDto.password,
          styles: [EmailMapping.USER_ACTIVE_ACCOUNT.templateFolder],
          activeLink: `${originName}/#/auth/confirm-password?token=${emailInfoDto.token}`,
        };
        const subject: string = await this.renderEmailTemplate(subjectPath, data);
        const text: string = await this.renderEmailTemplate(textPath, data);
        const html: string = await this.renderEmailTemplate(
          this.LAYOUT_FILE_PATH,
          data,
        );
        const msg = {
          ...this.STANDARD_MSG,
          to: emailInfoDto.email,
          subject,
          text,
          html,
          attachments: [this.HEADER_LOGO_ATTACHMENT],
        };
        return await this.sendMail(msg);
      }
}
