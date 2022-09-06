import { Data } from '../pages/data';
import { Donations } from '../pages/donations';
import { Help } from '../pages/help';
import { History } from '../pages/history';
import { InviteFriends } from '../pages/invite-friends';
import { Profile } from '../pages/profile';
import { Settings } from '../pages/settings';
import { Wallet } from '../pages/wallet';
import { RouteToPages } from '../paths';

const dataBlackIcon = '/static/images/icons/sidenav/data-black.svg';
const dataIcon = '/static/images/icons/sidenav/data.png';
const donationsBlackIcon = '/static/images/icons/sidenav/donations-black.svg';
const donationsIcon = '/static/images/icons/sidenav/donations.png';
const helpBlackIcon = '/static/images/icons/sidenav/help-black.svg';
const helpIcon = '/static/images/icons/sidenav/help.png';
const inviteFriendsBlackIcon =
  '/static/images/icons/sidenav/invite-friends-black.svg';
const inviteFriendsIcon = '/static/images/icons/sidenav/invite-friends.png';
const profileBlackIcon = '/static/images/icons/sidenav/profile-black.svg';
const profileIcon = '/static/images/icons/sidenav/profile.png';
const settingsBlackIcon = '/static/images/icons/sidenav/settings-black.svg';
const settingsIcon = '/static/images/icons/sidenav/settings.png';
const historyBlackIcon = '/static/images/icons/sidenav/history-black.svg';
const historyIcon = '/static/images/icons/sidenav/history.png';
const walletBlackIcon = '/static/images/icons/sidenav/wallet-black.svg';
const walletIcon = '/static/images/icons/sidenav/wallet.png';

export interface SidenavItem {
  title: string;
  icon?: { active: string; inactive: string };
  route: string;
  component: () => JSX.Element;
}

export const SidenavItems = [
  {
    title: 'Profile',
    icon: { active: profileIcon, inactive: profileBlackIcon },
    route: RouteToPages.profile,
    component: Profile,
  },
  {
    title: 'Wallet',
    icon: { active: walletIcon, inactive: walletBlackIcon },
    route: RouteToPages.wallet,
    component: Wallet,
  },
  {
    title: 'Donations',
    icon: { active: donationsIcon, inactive: donationsBlackIcon },
    route: RouteToPages.donations,
    component: Donations,
  },
  {
    title: 'Invite Friends',
    icon: { active: inviteFriendsIcon, inactive: inviteFriendsBlackIcon },
    route: RouteToPages.inviteFriends,
    component: InviteFriends,
  },
  {
    title: 'Data',
    icon: { active: dataIcon, inactive: dataBlackIcon },
    route: RouteToPages.data,
    component: Data,
  },
  {
    title: 'History',
    icon: { active: historyIcon, inactive: historyBlackIcon },
    route: RouteToPages.history,
    component: History,
  },
  {
    title: 'Settings',
    icon: { active: settingsIcon, inactive: settingsBlackIcon },
    route: RouteToPages.settings,
    component: Settings,
  },
  {
    title: 'Help',
    icon: { active: helpIcon, inactive: helpBlackIcon },
    route: RouteToPages.help,
    component: Help,
  },
] as SidenavItem[];
