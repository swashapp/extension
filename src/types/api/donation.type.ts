export type AddOngoingDonationReq = {
  charity_id: string;
  portion: number;
};

export type DeleteOngoingDonationReq = {
  donation_id: string;
};

export type ModifyOngoingDonationReq = AddOngoingDonationReq &
  DeleteOngoingDonationReq;

export type OngoingDonationRes = {
  id: string;
  charity_id: string;
  portion: number;
};
