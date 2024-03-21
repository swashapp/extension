import { Any } from "@/types/any.type";
import { HelperMessage } from "@/types/app.type";

export type SdkMessageEvent = MessageEvent<HelperMessage & { response: Any }>;
