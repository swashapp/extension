export type Site = {
  title: string;
  url: string;
  icon: string;
};

export type NewTab = {
  status: boolean;
  background: string;
  topSites: boolean;
  sites: Site[];
};
