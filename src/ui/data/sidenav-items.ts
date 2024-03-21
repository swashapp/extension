import { ReactNode } from "react";

import { InternalRoutes } from "@/paths";
import { Data } from "@/ui/pages/data";
import { Donation } from "@/ui/pages/donation";
import { EarnFromAds } from "@/ui/pages/earn-from-ads";
import { EarnMore } from "@/ui/pages/earn-more";
import { Earnings } from "@/ui/pages/earnings";
import { Help } from "@/ui/pages/help";
import { History } from "@/ui/pages/history";
import { InviteFriends } from "@/ui/pages/invite-friends";
import { Profile } from "@/ui/pages/profile";
import { Settings } from "@/ui/pages/settings";
import CoinsIcon from "~/images/icons/coins.svg?react";
import SettingsIcon from "~/images/icons/gear.svg?react";
import ProfileIcon from "~/images/icons/id.svg?react";
import HelpIcon from "~/images/icons/question.svg?react";
import DonateIcon from "~/images/icons/turn.svg?react";
import HistoryIcon from "~/images/icons/two-way.svg?react";
import WalletIcon from "~/images/icons/wallet.svg?react";

export interface SidenavItem {
  title: string;
  icon?: ({ className }: { className?: string }) => ReactNode;
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
    icon: ProfileIcon,
    route: InternalRoutes.profile,
    component: Profile,
    hidden: false,
  },
  {
    title: "Earnings",
    icon: WalletIcon,
    route: InternalRoutes.earnings,
    component: Earnings,
    hidden: false,
  },
  {
    title: "Earn More",
    icon: CoinsIcon,
    route: InternalRoutes.earnMore,
    component: EarnMore,
    hidden: false,
  },
  {
    title: "Donation",
    icon: DonateIcon,
    route: InternalRoutes.donation,
    component: Donation,
    hidden: false,
  },
  {
    title: "History",
    icon: HistoryIcon,
    route: InternalRoutes.history,
    component: History,
    hidden: false,
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    route: InternalRoutes.settings,
    component: Settings,
    hidden: false,
  },
  {
    title: "Help",
    icon: HelpIcon,
    route: InternalRoutes.help,
    component: Help,
    hidden: false,
  },
  ...HiddenItems,
] as SidenavItem[];
