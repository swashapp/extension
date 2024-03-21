export type NewTabSite = {
  title: string;
  url: string;
  logo: string;
};

export type NewTabSearchEngine = NewTabSite & {
  params: string;
};

export type NewTabDateTime = {
  seconds: boolean;
  h24: boolean;
};
