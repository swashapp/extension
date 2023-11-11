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
    title: 'Earn from surveys',
    subtitle: 'Share your opinion, get paid.',
    image: '/static/images/icons/earn/mouth.png',
    className: 'vivid-yellow-bg',
    link: SwashEarnPath,
  },
  {
    title: 'Earn from ads',
    subtitle: 'Get paid for seeing ads on your browser.',
    image: '/static/images/icons/earn/smile.png',
    className: 'ice-purple-bg',
    link: RouteToPages.earnFromAds,
  },
  {
    title: 'Referral bonus',
    subtitle: 'Earn more by inviting your friends.',
    image: '/static/images/icons/earn/speaker.png',
    className: 'mint-green-bg',
    link: RouteToPages.inviteFriends,
  },
  {
    title: 'Get the mobile app',
    subtitle: 'Earn on the go with the Swash mobile app.',
    image: '/static/images/icons/earn/cursor.png',
    className: 'ice-yellow-bg',
  },
] as EarnMoreItem[];
