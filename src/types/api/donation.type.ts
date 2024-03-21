export type AddOngoingDonationReq = {
  charity_id: string;
  portion: number;
};

export type DeleteOngoingDonationReq = {
  donation_id: string;
};

export type ModifyOngoingDonationReq = AddOngoingDonationReq &
  DeleteOngoingDonationReq;

export type OngoingRes = {
  id: string;
  charity_id: string;
  portion: number;
};
