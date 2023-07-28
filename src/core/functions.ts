import { ads } from './functions/ads';
import { ajax } from './functions/ajax';
import { browsing } from './functions/browsing';
import { content } from './functions/content';
import { sdk } from './functions/sdk';

const functions = [ads, ajax, browsing, content];
const persistentFunctions = [sdk];

export { functions, persistentFunctions };
