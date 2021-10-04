import { RouteToPages } from '../paths';
import walletIcon from 'url:../static/images/icons/sidenav/wallet.png';
import walletBlackIcon from 'url:../static/images/icons/sidenav/wallet-black.svg';
import donationsIcon from 'url:../static/images/icons/sidenav/donations.png';
import donationsBlackIcon from 'url:../static/images/icons/sidenav/donations-black.svg';
import inviteFriendsIcon from 'url:../static/images/icons/sidenav/invite-friends.png';
import inviteFriendsBlackIcon from 'url:../static/images/icons/sidenav/invite-friends-black.svg';
import settingsIcon from 'url:../static/images/icons/sidenav/settings.png';
import settingsBlackIcon from 'url:../static/images/icons/sidenav/settings-black.svg';
import helpIcon from 'url:../static/images/icons/sidenav/help.png';
import helpBlackIcon from 'url:../static/images/icons/sidenav/help-black.svg';
import Wallet from '../pages/Wallet';

export interface SidenavItem {
  title: string;
  icon?: { active: string; inactive: string };
  route: string;
  component: React.ComponentClass | null;
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
    component: null,
  },
  {
    title: 'Invite Friends',
    icon: { active: inviteFriendsIcon, inactive: inviteFriendsBlackIcon },
    route: RouteToPages.inviteFriends,
    component: null,
  },
  {
    title: 'Settings',
    icon: { active: settingsIcon, inactive: settingsBlackIcon },
    route: RouteToPages.settings,
    component: null,
  },
  {
    title: 'Help',
    icon: { active: helpIcon, inactive: helpBlackIcon },
    route: RouteToPages.help,
    component: null,
  },
] as SidenavItem[];
