// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import dataBlackIcon from 'url:../static/images/icons/sidenav/data-black.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import dataIcon from 'url:../static/images/icons/sidenav/data.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import donationsBlackIcon from 'url:../static/images/icons/sidenav/donations-black.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import donationsIcon from 'url:../static/images/icons/sidenav/donations.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import helpBlackIcon from 'url:../static/images/icons/sidenav/help-black.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import helpIcon from 'url:../static/images/icons/sidenav/help.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import inviteFriendsBlackIcon from 'url:../static/images/icons/sidenav/invite-friends-black.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import inviteFriendsIcon from 'url:../static/images/icons/sidenav/invite-friends.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import settingsBlackIcon from 'url:../static/images/icons/sidenav/settings-black.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import settingsIcon from 'url:../static/images/icons/sidenav/settings.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import walletBlackIcon from 'url:../static/images/icons/sidenav/wallet-black.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import walletIcon from 'url:../static/images/icons/sidenav/wallet.png';

import Data from '../pages/data';
import Help from '../pages/help';
import InviteFriends from '../pages/invite-friends';
import Settings from '../pages/settings';
import Wallet from '../pages/wallet';
import { RouteToPages } from '../paths';

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
    component: Help,
  },
] as SidenavItem[];
