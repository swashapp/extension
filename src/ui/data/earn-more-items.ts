import { InternalRoutes, SwashEarnURL, WebsiteURLs } from '../../paths';

export interface EarnMoreItem {
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export const EarnMoreItems = [
  {
    title: 'Earn from offers',
    subtitle: 'Complete daily tasks, get paid.',
    image: '/static/images/misc/talk.webp',
    link: SwashEarnURL,
  },
  {
    title: 'Earn from ads',
    subtitle: 'Get paid for seeing ads on your browser.',
    image: '/static/images/misc/smile.webp',
    link: InternalRoutes.earnFromAds,
  },
  {
    title: 'Referral bonus',
    subtitle: 'Earn more by inviting your friends.',
    image: '/static/images/misc/speaker.webp',
    link: InternalRoutes.inviteFriends,
  },
  {
    title: 'Get the mobile app',
    subtitle: 'Earn on the go with the Swash mobile app.',
    image: '/static/images/misc/cursor.webp',
    link: WebsiteURLs.contact,
  },
] as EarnMoreItem[];
