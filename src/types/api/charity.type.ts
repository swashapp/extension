import { WithdrawType } from "@/enums/withdraw.enum";

export type GetCharityInfoRes = {
  id: string;
  name: string;
  category: string;
  location: string;
  banner: string;
  logo: string;
  website: string;
  wallet: string;
  description: string;
  mission: string;
  program: string;
  result: string;
};

export type DonateToCharityReq = {
  withdrawType: WithdrawType.Donation;
  userWallet: string;
  receiver: string;
  withdrawAmount: number;
  withdrawTime: number;
  validityTime: number;
  userSignature: string;
};
