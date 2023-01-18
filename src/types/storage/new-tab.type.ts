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
