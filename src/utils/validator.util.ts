export function isValidWallet(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/i.test(value);
}

export function isValidPrivateKey(value: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/i.test(value);
}

export function isValidEmail(value: string): boolean {
  return /^(([^<>()[\]\\.,;+:\s@"]+(\.[^<>()[\]\\.,;+:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value,
  );
}

export function isValidPassword(value: string) {
  return value.length >= 1;
}

export function isValidURL(value: string) {
  return /^(https?:\/\/)?((([a-zA-Z0-9\-.]+)\.[a-zA-Z]{2,})|localhost)(:[0-9]+)?(\/\S*)?$/i.test(
    value,
  );
}

export function isValidPhoneNumber(value: string) {
  return /^\+?[0-9]{10,15}$/i.test(value);
}
