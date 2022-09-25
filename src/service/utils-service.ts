export const initValue = 'SWASH';
export class UtilsService {
  static purgeNumber(num: string, precision = 2): string {
    if (num.indexOf('.') < 0) return num;
    return num.slice(
      0,
      num.indexOf('.') + (precision === 0 ? -1 : precision) + 1,
    );
  }

  static purgeString(tx: string, len = 10): string {
    if (tx.length < len * 2) return tx;
    return tx.substring(0, len) + '...' + tx.substring(tx.length - len);
  }

  static padWithZero(num: number): string {
    return String(num).padStart(2, '0');
  }
}
