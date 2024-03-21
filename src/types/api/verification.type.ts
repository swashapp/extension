import { VerificationType } from '../../enums/api.enum';

export type InitVerificationReq =
  | {
      type: VerificationType.EMAIL;
      [VerificationType.EMAIL]: string;
      'g-recaptcha-response': string;
    }
  | {
      type: VerificationType.PHONE;
      [VerificationType.PHONE]: string;
      'g-recaptcha-response': string;
    };

export type VerifyCodeReq = {
  type: VerificationType;
  request_id: string;
  code: string;
};

export type InitVerificationRes = {
  request_id: string;
};
