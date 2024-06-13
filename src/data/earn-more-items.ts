import { RouteToPages, SwashEarnPath } from '../paths';

export interface EarnMoreItem {
  title: string;
  subtitle: string;
  image: string;
  className: string;
  link?: string;
}

export const EarnMoreItems = [
  {
    title: 'Earn from offers',
    subtitle: 'Complete daily tasks, get paid.',
    image: '/static/images/icons/earn/mouth.png',
    className: 'bg-yellow',
    link: SwashEarnPath,
  },
  {
    title: 'Earn from ads',
    subtitle: 'Get paid for seeing ads on your browser.',
    image: '/static/images/icons/earn/smile.png',
    className: 'bg-purple',
    link: RouteToPages.earnFromAds,
  },
  {
    title: 'Referral bonus',
    subtitle: 'Earn more by inviting your friends.',
    image: '/static/images/icons/earn/speaker.png',
    className: 'bg-soft-green',
    link: RouteToPages.inviteFriends,
  },
  {
    title: 'Get the mobile app',
    subtitle: 'Earn on the go with the Swash mobile app.',
    image: '/static/images/icons/earn/cursor.png',
    className: 'bg-soft-yellow',
  },
] as EarnMoreItem[];
