import { SUPPORT_URLS } from "@/paths";

export interface HelpItem {
  title: string;
  image: string;
  className: string;
  link: string;
}

export const HelpItems = [
  {
    title: "General",
    image: "/images/misc/question.webp",
    className: "bg-soft-yellow",
    link: SUPPORT_URLS.general,
  },
  {
    title: "My Swash Account",
    image: "/images/misc/person.webp",
    className: "bg-soft-green",
    link: SUPPORT_URLS.account,
  },
  {
    title: "Earn More",
    image: "/images/misc/save.webp",
    className: "bg-purple",
    link: SUPPORT_URLS.earnMore,
  },
  {
    title: "Data for Good",
    image: "/images/misc/flower.webp",
    className: "bg-soft-green",
    link: SUPPORT_URLS.dataForGood,
  },
  {
    title: "Community & Ecosystem",
    image: "/images/misc/wave-hand.webp",
    className: "bg-purple",
    link: SUPPORT_URLS.ecosystem,
  },
  {
    title: "Data Privacy",
    image: "/images/misc/shield.webp",
    className: "bg-soft-yellow",
    link: SUPPORT_URLS.privacy,
  },
] as HelpItem[];
