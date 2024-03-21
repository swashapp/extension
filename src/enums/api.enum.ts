export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum ResponseStatus {
  ERROR = "error",
  SUCCESS = "success",
}

export enum AccountDetailsEnum {
  REFERRAL = "referral",
  DONATION = "donation",
  INFO = "info",
}

export enum AcceptedAuth {
  EWT = "ewt",
  BASIC = "basic",
}

export enum DeviceType {
  EXTENSION = "extension",
  SMARTPHONE = "smartphone",
  TABLET = "tablet",
  WATCH = "watch",
  TV = "tv",
}

export enum VerificationType {
  EMAIL = "email",
  PHONE = "phone",
}

export enum VerificationActionType {
  REGISTER = "register",
  LOGIN = "login",
  INFO = "info",
  RESET_PASSWORD = "reset-password",
  RESET_WALLET = "reset-wallet",
}
