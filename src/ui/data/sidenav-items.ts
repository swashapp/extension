import { ReactNode } from "react";

import { InternalRoutes } from "@/paths";

import { Data } from "../pages/data";
import { Donation } from "../pages/donation";
import { EarnFromAds } from "../pages/earn-from-ads";
import { EarnMore } from "../pages/earn-more";
import { Earnings } from "../pages/earnings";
import { Help } from "../pages/help";
import { History } from "../pages/history";
import { InviteFriends } from "../pages/invite-friends";
import { Profile } from "../pages/profile";
import { Settings } from "../pages/settings";

export interface SidenavItem {
  title: string;
  icon?: { url: string };
  route: string;
  component: () => ReactNode;
  hidden: boolean;
}

const HiddenItems = [
  {
    title: "Earn From Ads",
    route: InternalRoutes.earnFromAds,
    component: EarnFromAds,
    hidden: true,
  },
  {
    title: "Invite Friends",
    route: InternalRoutes.inviteFriends,
    component: InviteFriends,
    hidden: true,
  },
  {
    title: "Data",
    route: InternalRoutes.data,
    component: Data,
    hidden: true,
  },
];

export const SidenavItems = [
  {
    title: "Profile",
    icon: { url: "/images/icons/sidenav/profile.svg" },
    route: InternalRoutes.profile,
    component: Profile,
    hidden: false,
  },
  {
    title: "Earnings",
    icon: { url: "/images/icons/sidenav/wallet.svg" },
    route: InternalRoutes.earnings,
    component: Earnings,
    hidden: false,
  },
  {
    title: "Earn More",
    icon: { url: "/images/icons/sidenav/earn-more.svg" },
    route: InternalRoutes.earnMore,
    component: EarnMore,
    hidden: false,
  },
  {
    title: "Donation",
    icon: { url: "/images/icons/sidenav/donations.svg" },
    route: InternalRoutes.donation,
    component: Donation,
    hidden: false,
  },
  {
    title: "History",
    icon: { url: "/images/icons/sidenav/history.svg" },
    route: InternalRoutes.history,
    component: History,
    hidden: false,
  },
  {
    title: "Settings",
    icon: { url: "/images/icons/sidenav/settings.svg" },
    route: InternalRoutes.settings,
    component: Settings,
    hidden: false,
  },
  {
    title: "Help",
    icon: { url: "/images/icons/sidenav/help.svg" },
    route: InternalRoutes.help,
    component: Help,
    hidden: false,
  },
  ...HiddenItems,
] as SidenavItem[];
