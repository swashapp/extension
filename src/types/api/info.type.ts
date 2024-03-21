import { SelectItem } from "@/types/ui.type";

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
  gender: SelectItem[];
  marital: SelectItem[];
  household: SelectItem[];
  employment: SelectItem[];
  industry: SelectItem[];
  income: SelectItem[];
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
