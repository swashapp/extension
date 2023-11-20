import { RouteToHelpdesk } from '../paths';

export interface HelpItem {
  title: string;
  image: string;
  className: string;
  link: string;
}

export const HelpItems = [
  {
    title: 'General',
    image: '/static/images/icons/help/question.png',
    className: 'bg-soft-yellow',
    link: RouteToHelpdesk.general,
  },
  {
    title: 'My Swash Account',
    image: '/static/images/icons/help/person.png',
    className: 'bg-soft-green',
    link: RouteToHelpdesk.account,
  },
  {
    title: 'Earn More',
    image: '/static/images/icons/help/save.png',
    className: 'bg-purple',
    link: RouteToHelpdesk.earnMore,
  },
  {
    title: 'Data for Good',
    image: '/static/images/icons/help/flower.png',
    className: 'bg-soft-green',
    link: RouteToHelpdesk.dataForGood,
  },
  {
    title: 'Community & Ecosystem',
    image: '/static/images/icons/help/hand.png',
    className: 'bg-purple',
    link: RouteToHelpdesk.ecosystem,
  },
  {
    title: 'Data Privacy',
    image: '/static/images/icons/help/shield.png',
    className: 'bg-soft-yellow',
    link: RouteToHelpdesk.privacy,
  },
] as HelpItem[];
