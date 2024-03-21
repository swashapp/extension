export const InternalRoutes = {
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
};

const dashboardPath = "ui/dashboard.html";
export const InternalPaths = {
  dashboard: dashboardPath,

  data: `${dashboardPath}#/data`,
  donation: `${dashboardPath}#/donation`,
  earnFromAds: `${dashboardPath}#/earn-from-ads`,
  earnings: `${dashboardPath}#/earnings`,
  earnMore: `${dashboardPath}#/earn-more`,
  help: `${dashboardPath}#/help`,
  history: `${dashboardPath}#/history`,
  inviteFriends: `${dashboardPath}#/invite-friends`,
  onboarding: `${dashboardPath}#/onboarding`,
  profile: `${dashboardPath}#/profile`,
  settings: `${dashboardPath}#/settings`,

  newTab: `ui/new-tab.html`,
  popup: `ui/popup.html`,
};

const websiteURL = "https://swashapp.io";
export const WebsiteURLs = {
  home: `${websiteURL}/`,

  contact: `${websiteURL}/contact`,
  faq: `${websiteURL}/faq`,
  media: `${websiteURL}/media`,
  newsletter: `${websiteURL}/newsletter`,
  privacy: `${websiteURL}/privacy-policy`,
  request: `${websiteURL}/request`,
  terms: `${websiteURL}/terms-use`,

  adview: `${websiteURL}/user/ads/view`,
  recaptcha: `${websiteURL}/user/human-check`,
};

export const SwashEarnURL = "https://earn.swashapp.io";

const swashSupportURL = "https://support.swashapp.io/hc/en-us";
export const SwashSupportURLs = {
  home: `${swashSupportURL}/`,

  submitTicket: `${swashSupportURL}/requests/new`,

  account: `${swashSupportURL}/categories/18760349156753-My-Swash-Account`,
  advertise: `${swashSupportURL}/categories/18776725537553-Advertising-with-Swash-Ads`,
  dataForGood: `${swashSupportURL}/categories/18776696054673-Data-for-Good`,
  ecosystem: `${swashSupportURL}/categories/18776713325713-Community-Ecosystem`,
  earnMore: `${swashSupportURL}/categories/18776690841233-Earn-More`,
  general: `${swashSupportURL}/categories/18776757460625-General`,
  other: `${swashSupportURL}/categories/18776743614225-Other-Swash-Solutions`,
  privacy: `${swashSupportURL}/categories/18776359769233-Data-Privacy`,
};
