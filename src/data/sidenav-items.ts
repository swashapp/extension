import { Data } from '../pages/data';
import { Donations } from '../pages/donations';
import { Help } from '../pages/help';
import { InviteFriends } from '../pages/invite-friends';
import { Settings } from '../pages/settings';
import { Transactions } from '../pages/transactions';
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
const transactionsBlackIcon =
  '/static/images/icons/sidenav/transactions-black.svg';
const transactionsIcon = '/static/images/icons/sidenav/transactions.png';
const settingsBlackIcon = '/static/images/icons/sidenav/settings-black.svg';
const settingsIcon = '/static/images/icons/sidenav/settings.png';
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
    title: 'Transactions',
    icon: { active: transactionsIcon, inactive: transactionsBlackIcon },
    route: RouteToPages.transactions,
    component: Transactions,
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
