import { VerificationType } from "@/enums/api.enum";

export type InitVerificationReq =
  | {
      type: VerificationType.EMAIL;
      [VerificationType.EMAIL]: string;
      "g-recaptcha-response": string;
    }
  | {
      type: VerificationType.PHONE;
      [VerificationType.PHONE]: string;
      "g-recaptcha-response": string;
    };

export type ResetVerificationReq = {
  type: VerificationType;
  request_id: string;
};

export type VerifyCodeReq = ResetVerificationReq & {
  code: string;
};

export type InitVerificationRes = {
  request_id: string;
};
