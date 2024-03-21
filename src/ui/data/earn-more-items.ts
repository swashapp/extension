import { EARN_WEBSITE, DASHBOARD_PATHS, WEBSITE_URLs } from "@/paths";

export interface EarnMoreItem {
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export const EarnMoreItems = [
  {
    title: "Earn from offers",
    subtitle: "Complete daily tasks, get paid.",
    image: "/images/misc/talk.webp",
    link: EARN_WEBSITE,
  },
  {
    title: "Earn from ads",
    subtitle: "Get paid for seeing ads on your browser.",
    image: "/images/misc/smile.webp",
    link: DASHBOARD_PATHS.earnFromAds,
  },
  {
    title: "Referral bonus",
    subtitle: "Earn more by inviting your friends.",
    image: "/images/misc/speaker.webp",
    link: DASHBOARD_PATHS.inviteFriends,
  },
  {
    title: "Get the mobile app",
    subtitle: "Earn on the go with the Swash mobile app.",
    image: "/images/misc/cursor.webp",
    link: WEBSITE_URLs.contact,
  },
] as EarnMoreItem[];
