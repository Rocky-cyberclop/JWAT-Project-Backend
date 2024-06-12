import { Address } from 'nodemailer/lib/mailer';

export type MutateProjectMailDto = {
  recipients: Address[];
  subject: string;
  project: string;
};
