import { SearchEngine } from '../../enums/search-engine.enum';
import { NewTabSearchEngine } from '../../types/new-tab.type';

export const SearchEngines: NewTabSearchEngine[] = [
  {
    title: SearchEngine.GOOGLE,
    url: 'https://www.google.com/search',
    logo: '/static/images/logos/google.png',
    params: 'q',
  },
  {
    title: SearchEngine.BING,
    url: 'https://www.bing.com/search',
    logo: '/static/images/logos/bing.png',
    params: 'q',
  },
  {
    title: SearchEngine.DUCKDUCKGO,
    url: 'https://duckduckgo.com/',
    logo: '/static/images/logos/duckduckgo.png',
    params: 'q',
  },
  {
    title: SearchEngine.ECOSIA,
    url: 'https://www.ecosia.org/search',
    logo: '/static/images/logos/ecosia.png',
    params: 'q',
  },
];
