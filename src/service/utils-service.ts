export class UtilsService {
  static purgeNumber(num: string, precision = 2): string {
    if (num.indexOf('.') < 0) return num;
    return num.slice(
      0,
      num.indexOf('.') + (precision === 0 ? -1 : precision) + 1,
    );
  }
}
