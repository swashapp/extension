export type Site = {
  title: string;
  url: string;
  icon: string;
};

export type SearchEngine = {
  name: string;
  url: string;
  params: string;
  logo: string;
};

export type NewTab = {
  status: boolean;
  background: string;
  searchEngine: SearchEngine;
  topSites: boolean;
  sites: Site[];
};

export type UnsplashCopyright = {
  imageLink: string;
  location: string | null;
  userName: string;
  userLink: string;
};

export type UnsplashResponse = {
  src: string;
  copyright: UnsplashCopyright;
};
