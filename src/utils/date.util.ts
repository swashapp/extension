import dayjs, { Dayjs } from "dayjs";

export function getTimestamp(inSeconds: boolean = false): number {
  if (!inSeconds) return dayjs().valueOf();
  return dayjs().unix();
}

export function isTimeAfter(date?: string | number | Date | Dayjs): boolean {
  return dayjs().isAfter(date);
}

export function formatDate(
  date?: string | number | Date | Dayjs,
  format: string = "DD/MMM/YYYY HH:mm:ss Z",
): string {
  return dayjs(date).format(format);
}

export function getAge(birth: number): number {
  return dayjs().year() - birth;
}
