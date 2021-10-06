import { RouteToPages } from '../paths';
import walletIcon from 'url:../static/images/icons/sidenav/wallet.png';
import walletBlackIcon from 'url:../static/images/icons/sidenav/wallet-black.svg';
import donationsIcon from 'url:../static/images/icons/sidenav/donations.png';
import donationsBlackIcon from 'url:../static/images/icons/sidenav/donations-black.svg';
import inviteFriendsIcon from 'url:../static/images/icons/sidenav/invite-friends.png';
import inviteFriendsBlackIcon from 'url:../static/images/icons/sidenav/invite-friends-black.svg';
import dataIcon from 'url:../static/images/icons/sidenav/data.png';
import dataBlackIcon from 'url:../static/images/icons/sidenav/data-black.svg';
import settingsIcon from 'url:../static/images/icons/sidenav/settings.png';
import settingsBlackIcon from 'url:../static/images/icons/sidenav/settings-black.svg';
import helpIcon from 'url:../static/images/icons/sidenav/help.png';
import helpBlackIcon from 'url:../static/images/icons/sidenav/help-black.svg';
import Wallet from '../pages/wallet';
import InviteFriends from '../pages/invite-friends';
import Settings from '../pages/settings';
import Data from '../pages/data';

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
    component: InviteFriends,
  },
  {
    title: 'Data',
    icon: { active: dataIcon, inactive: dataBlackIcon },
    route: RouteToPages.data,
    component: Data,
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
    component: null,
  },
] as SidenavItem[];
