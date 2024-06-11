import { Address } from 'nodemailer/lib/mailer';

export type CreateUserMailDto = {
  recipients: Address[];
  subject: string;
  username: string;
  password: string;
};
