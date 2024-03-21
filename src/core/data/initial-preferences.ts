export const InitialPreferences = {
  delay: 2 * 60 * 1000,

  ads: {
    status: { fullscreen: false, notification: false, integrated: false },
    filters: { endsAt: 0, urls: [] },
  },
  new_tab: {
    background: "rgb(36, 36, 36)",
    datetime: {
      h24: true,
      seconds: false,
    },
    search_engine: {
      title: "Google",
      url: "https://www.google.com/search",
      logo: "/images/logos/google.png",
      params: "q",
    },
    sites: {
      0: {
        title: "Swashapp",
        url: "https://swashapp.io",
        logo: "https://www.google.com/s2/favicons?sz=64&domain_url=https://swashapp.io",
      },
    },
  },
  charities: [],
};
