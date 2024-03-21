import { ReactNode } from "react";

export interface VerificationBannerItem {
  text: ReactNode;
  image: string;
  verified: boolean;
}

const imgStyle = {
  marginBottom: "-0.25em",
};

export const VerificationBannerItems = [
  {
    text: (
      <>
        To withdraw{" "}
        <img
          src={"/images/icons/profile/wallet.svg"}
          alt={"wallet"}
          style={imgStyle}
        />{" "}
        your{" "}
        <img
          src={"/images/icons/profile/diamond.svg"}
          alt={"diamond"}
          style={imgStyle}
        />{" "}
        earnings, verify your profile.
      </>
    ),
    image: "/images/icons/verification-banner/person.png",
    verified: false,
  },
  {
    text: (
      <>
        Congrats!{" "}
        <img
          src={"/images/icons/profile/swash.svg"}
          alt={"swash"}
          style={imgStyle}
        />{" "}
        Your profile is now verified
      </>
    ),
    image: "/images/icons/verification-banner/box.png",
    verified: true,
  },
] as VerificationBannerItem[];
