export const WEBSITE = "https://swashapp.io";
export const EARN_WEBSITE = "https://earn.swashapp.io";
export const SUPPORT_WEBSITE = "https://support.swashapp.io/hc/en-us";
export const API_GATEWAY = "https://api.swashapp.io";
export const ADS_GATEWAY = "https://app.swashapp.io";
export const STREAM_GATEWAY = "https://stream.swashapp.io";

export const DASHBOARD_PATHS = {
  dashboard: `/`,

  data: `/data`,
  donation: `/donation`,
  earnFromAds: `/earn-from-ads`,
  earnings: `/earnings`,
  earnMore: `/earn-more`,
  help: `/help`,
  history: `/history`,
  inviteFriends: `/invite-friends`,
  onboarding: `/onboarding`,
  profile: `/profile`,
  settings: `/settings`,
  upgrade: `/upgrade-to-v3`,
};

const dashboard = "ui/dashboard.html";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const INTERNAL_PATHS: {
  newTab: string;
  popup: string;
} & { [key in keyof typeof DASHBOARD_PATHS]: string } = {
  ...Object.fromEntries(
    Object.entries(DASHBOARD_PATHS).map(([key, path]) => [
      key,
      `${dashboard}#${path}`,
    ]),
  ),
  newTab: `ui/new-tab.html`,
  popup: `ui/popup.html`,
  dashboard,
};

export const WEBSITE_URLs = {
  home: `${WEBSITE}/`,

  contact: `${WEBSITE}/contact`,
  download: `${WEBSITE}/download`,
  ecosystem: `${WEBSITE}/ecosystem`,
  faq: `${WEBSITE}/faq`,
  media: `${WEBSITE}/media`,
  newsletter: `${WEBSITE}/newsletter`,
  privacy: `${WEBSITE}/privacy-policy`,
  request: `${WEBSITE}/request`,
  terms: `${WEBSITE}/terms-use`,

  adview: `${WEBSITE}/user/ads/view`,
  recaptcha: `${WEBSITE}/user/human-check`,

  v3_upgrade_blog: `${WEBSITE}/blog/swash-v3-everything-you-need-to-know/`,
};

export const SUPPORT_URLS = {
  home: `${SUPPORT_WEBSITE}/`,

  submitTicket: `${SUPPORT_WEBSITE}/requests/new`,

  account: `${SUPPORT_WEBSITE}/categories/18760349156753-My-Swash-Account`,
  advertise: `${SUPPORT_WEBSITE}/categories/18776725537553-Advertising-with-Swash-Ads`,
  dataForGood: `${SUPPORT_WEBSITE}/categories/18776696054673-Data-for-Good`,
  ecosystem: `${SUPPORT_WEBSITE}/categories/18776713325713-Community-Ecosystem`,
  earnMore: `${SUPPORT_WEBSITE}/categories/18776690841233-Earn-More`,
  general: `${SUPPORT_WEBSITE}/categories/18776757460625-General`,
  other: `${SUPPORT_WEBSITE}/categories/18776743614225-Other-Swash-Solutions`,
  privacy: `${SUPPORT_WEBSITE}/categories/18776359769233-Data-Privacy`,

  withdrawalHelp: `${SUPPORT_WEBSITE}/articles/18813260189201-How-do-I-withdraw-my-earnings`,
  revenueSharing: `${SUPPORT_WEBSITE}/articles/32021551513873-What-are-revenue-sharing-referrals`,
  monthlyReferral: `${SUPPORT_WEBSITE}/articles/32021545608721-How-do-the-monthly-referrals-work`,
  limitedReferral: `${SUPPORT_WEBSITE}/articles/32021633673233-How-do-Limited-referrals-work`,
};
