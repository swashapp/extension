import { BaseError } from "@/base-error";
import { ResponseStatus } from "@/enums/api.enum";
import { SystemMessage } from "@/enums/message.enum";
import {
  BaseErrorResponseDto,
  BaseSuccessfulResponseDto,
} from "@/types/api/response.type";

export async function swashResponseTransformer<T>(
  response: Response,
): Promise<T> {
  const body = (await response.json()) as
    | BaseSuccessfulResponseDto<T>
    | BaseErrorResponseDto;

  if (body.status === ResponseStatus.SUCCESS) return body.data as T;
  if (body.status === ResponseStatus.ERROR) throw new BaseError(body.message);

  throw new BaseError(SystemMessage.UNSUPPORTED_RESPONSE_TYPE);
}
