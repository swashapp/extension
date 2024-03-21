import { ComponentType } from "react";

import { DASHBOARD_PATHS } from "@/paths";
import { Any } from "@/types/any.type";
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
import { UpgradeToV3 } from "@/ui/pages/upgrade-to-v3";
import CoinsIcon from "~/images/icons/coins.svg?react";
import SettingsIcon from "~/images/icons/gear.svg?react";
import ProfileIcon from "~/images/icons/id.svg?react";
import HelpIcon from "~/images/icons/question.svg?react";
import DonateIcon from "~/images/icons/turn.svg?react";
import HistoryIcon from "~/images/icons/two-way.svg?react";
import WalletIcon from "~/images/icons/wallet.svg?react";

export interface SidebarLink {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  route: string;
  component: ComponentType<Any>;
  hidden: boolean;
}
const HiddenItems: SidebarLink[] = [
  {
    title: "Earn From Ads",
    route: DASHBOARD_PATHS.earnFromAds,
    component: EarnFromAds,
    hidden: true,
  },
  {
    title: "Invite Friends",
    route: DASHBOARD_PATHS.inviteFriends,
    component: InviteFriends,
    hidden: true,
  },
  {
    title: "Data",
    route: DASHBOARD_PATHS.data,
    component: Data,
    hidden: true,
  },
];

export const SidebarLinks: SidebarLink[] = [
  {
    title: "Profile",
    icon: ProfileIcon,
    route: DASHBOARD_PATHS.profile,
    component: Profile,
    hidden: false,
  },
  {
    title: "Earnings",
    icon: WalletIcon,
    route: DASHBOARD_PATHS.earnings,
    component: Earnings,
    hidden: false,
  },
  {
    title: "Earn More",
    icon: CoinsIcon,
    route: DASHBOARD_PATHS.earnMore,
    component: EarnMore,
    hidden: false,
  },
  {
    title: "Donation",
    icon: DonateIcon,
    route: DASHBOARD_PATHS.donation,
    component: Donation,
    hidden: false,
  },
  {
    title: "History",
    icon: HistoryIcon,
    route: DASHBOARD_PATHS.history,
    component: History,
    hidden: false,
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    route: DASHBOARD_PATHS.settings,
    component: Settings,
    hidden: false,
  },
  {
    title: "Help",
    icon: HelpIcon,
    route: DASHBOARD_PATHS.help,
    component: Help,
    hidden: false,
  },
  ...HiddenItems,
];

export const SidebarMigrationLinks: SidebarLink[] = [
  ...SidebarLinks.map((item) => ({ ...item, component: UpgradeToV3 })),
  {
    title: "Upgrade To V3",
    route: DASHBOARD_PATHS.upgrade,
    component: UpgradeToV3,
    hidden: true,
  },
];
