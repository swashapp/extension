import { BaseError } from "@/base-error";
import { ResponseStatus } from "@/enums/api.enum";
import { SystemMessage } from "@/enums/message.enum";
import {
  BaseErrorResponseDto,
  BaseSuccessfulResponseDto,
} from "@/types/api/response.type";
import { Logger } from "@/utils/log.util";

export async function swashResponseTransformer<T>(
  response: Response,
): Promise<T> {
  const body = (await response.json()) as
    | BaseSuccessfulResponseDto<T>
    | BaseErrorResponseDto;

  if (body.status === ResponseStatus.SUCCESS) return body.data as T;
  if (body.status === ResponseStatus.ERROR) {
    Logger.error("Server response is error:", body);

    let message = body.message;
    if (body.reasons && body.reasons.length > 0)
      message += `\n${body.reasons[0]}`;
    throw new BaseError(message);
  }

  throw new BaseError(SystemMessage.UNSUPPORTED_RESPONSE_TYPE);
}
