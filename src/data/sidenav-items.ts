import { Data } from '../pages/data';
import { Donations } from '../pages/donations';
import { EarnFromAds } from '../pages/earn-from-ads';
import { EarnMore } from '../pages/earn-more';
import { Earnings } from '../pages/earnings';
import { Help } from '../pages/help';
import { History } from '../pages/history';
import { InviteFriends } from '../pages/invite-friends';
import { Profile } from '../pages/profile';
import { Settings } from '../pages/settings';
import { RouteToPages } from '../paths';

const profileIcon = '/static/images/icons/sidenav/profile.svg';
const walletIcon = '/static/images/icons/sidenav/wallet.svg';
const earnMoreIcon = '/static/images/icons/sidenav/earn-more.svg';
const donationsIcon = '/static/images/icons/sidenav/donations.svg';
const historyIcon = '/static/images/icons/sidenav/history.svg';
const settingsIcon = '/static/images/icons/sidenav/settings.svg';
const helpIcon = '/static/images/icons/sidenav/help.svg';

export interface SidenavItem {
  title: string;
  icon?: { url: string };
  route: string;
  component: () => JSX.Element;
  hidden: boolean;
}

const HiddenItems = [
  {
    title: 'Earn From Ads',
    route: RouteToPages.earnFromAds,
    component: EarnFromAds,
    hidden: true,
  },
  {
    title: 'Invite Friends',
    route: RouteToPages.inviteFriends,
    component: InviteFriends,
    hidden: true,
  },
  {
    title: 'Data',
    route: RouteToPages.data,
    component: Data,
    hidden: true,
  },
];

export const SidenavItems = [
  {
    title: 'Profile',
    icon: { url: profileIcon },
    route: RouteToPages.profile,
    component: Profile,
    hidden: false,
  },
  {
    title: 'Earnings',
    icon: { url: walletIcon },
    route: RouteToPages.earnings,
    component: Earnings,
    hidden: false,
  },
  {
    title: 'Earn More',
    icon: { url: earnMoreIcon },
    route: RouteToPages.earnMore,
    component: EarnMore,
    hidden: false,
  },
  {
    title: 'Donations',
    icon: { url: donationsIcon },
    route: RouteToPages.donations,
    component: Donations,
    hidden: false,
  },
  {
    title: 'History',
    icon: { url: historyIcon },
    route: RouteToPages.history,
    component: History,
    hidden: false,
  },
  {
    title: 'Settings',
    icon: { url: settingsIcon },
    route: RouteToPages.settings,
    component: Settings,
    hidden: false,
  },
  {
    title: 'Help',
    icon: { url: helpIcon },
    route: RouteToPages.help,
    component: Help,
    hidden: false,
  },
  ...HiddenItems,
] as SidenavItem[];
