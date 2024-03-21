import { SwashSupportURLs } from "@/paths";

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
    link: SwashSupportURLs.general,
  },
  {
    title: "My Swash Account",
    image: "/images/misc/person.webp",
    className: "bg-soft-green",
    link: SwashSupportURLs.account,
  },
  {
    title: "Earn More",
    image: "/images/misc/save.webp",
    className: "bg-purple",
    link: SwashSupportURLs.earnMore,
  },
  {
    title: "Data for Good",
    image: "/images/misc/flower.webp",
    className: "bg-soft-green",
    link: SwashSupportURLs.dataForGood,
  },
  {
    title: "Community & Ecosystem",
    image: "/images/misc/wave-hand.webp",
    className: "bg-purple",
    link: SwashSupportURLs.ecosystem,
  },
  {
    title: "Data Privacy",
    image: "/images/misc/shield.webp",
    className: "bg-soft-yellow",
    link: SwashSupportURLs.privacy,
  },
] as HelpItem[];
