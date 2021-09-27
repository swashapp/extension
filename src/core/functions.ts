import { apiCall } from './functions/apiCall';
import { browsing } from './functions/browsing';
import { content } from './functions/content';
import { context } from './functions/context';
import { task } from './functions/task';
import { transfer } from './functions/transfer';

const functions = [
  browsing,
  content,
  apiCall,
  context,
  task,
  //transfer
];
export { functions };
