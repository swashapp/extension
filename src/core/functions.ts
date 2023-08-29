import { browserUtils } from '../utils/browser.util';

import { ads } from './functions/ads';
import { ajax } from './functions/ajax';
import { browsing } from './functions/browsing';
import { content } from './functions/content';
import { sdk } from './functions/sdk';

const functions = [];
const persistentFunctions = [];

if (browserUtils.isSafari()) {
  functions.push(ads, content);
} else {
  functions.push(ads, ajax, browsing, content);
  persistentFunctions.push(sdk);
}

export { functions, persistentFunctions };
