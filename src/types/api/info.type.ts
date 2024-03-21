export type ModifyAdditionalInfoReq = {
  birth?: number;
  gender?: string;
  marital?: string;
  household?: string;
  employment?: string;
  income?: string;
  industry?: string;
};

export type GetAvailableInfo = {
  birth: { min: number; max: number };
  gender: { value: string; display: string }[];
  marital: { value: string; display: string }[];
  household: { value: string; display: string }[];
  employment: { value: string; display: string }[];
  industry: { value: string; display: string }[];
  income: { value: string; display: string }[];
};

export type GetVerifiedInfoRes = {
  email: string;
  phone: string;
};

export type GetAdditionalInfoRes = {
  birth: string;
  gender: string;
  marital: string;
  household: string;
  employment: string;
  income: string;
  industry: string;
};
