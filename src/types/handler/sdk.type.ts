import { Any } from '../any.type';
import { HelperMessage } from '../app.type';

export type SdkMessageEvent = MessageEvent<HelperMessage & { response: Any }>;
