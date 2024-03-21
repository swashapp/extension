import { ResponseStatus } from "@/enums/api.enum";

export type BaseResponseDto<T> = {
  readonly status: T;
};

export type BaseSuccessfulResponseDto<T> =
  BaseResponseDto<ResponseStatus.SUCCESS> & {
    readonly data?: T;
  };

export type BaseErrorResponseDto = BaseResponseDto<ResponseStatus.ERROR> & {
  readonly message: string;
  readonly reasons?: string[];
};
