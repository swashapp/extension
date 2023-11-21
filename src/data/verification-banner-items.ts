export interface VerificationBannerItem {
  text: string;
  image: string;
  className: string;
  verified: boolean;
}

export const VerificationBannerItems = [
  {
    text: 'To withdraw your earnings, verify your profile.',
    image: '/static/images/icons/verification-banner/person.png',
    className: 'bg-soft-yellow',
    verified: false,
  },
  {
    text: 'Congrats! You are a verified Swash member!',
    image: '/static/images/icons/verification-banner/box.png',
    className: 'bg-soft-green',
    verified: true,
  },
] as VerificationBannerItem[];
