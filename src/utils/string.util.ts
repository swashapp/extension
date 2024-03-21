export const BalanceInitValue = "Loading...";

export function purgeNumber(num: string, precision = 4): string {
  const decimalIndex = num.indexOf(".");
  if (decimalIndex < 0 || precision < 0) return num;
  return num.slice(0, decimalIndex + (precision || -1) + 1);
}

export function purgeString(str: string, len = 10): string {
  return str.length < len * 2
    ? str
    : str.slice(0, len) + "..." + str.slice(-len);
}

export function padWithZero(num: number): string {
  return String(num).padStart(2, "0");
}
