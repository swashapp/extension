export const isGreaterThan = (version1: string, version2: string): boolean => {
  const [major1, minor1, patch1] = version1.split(".").map(Number);
  const [major2, minor2, patch2] = version2.split(".").map(Number);
  if (major1 > major2) return true;
  if (major1 < major2) return false;
  if (minor1 > minor2) return true;
  if (minor1 < minor2) return false;
  return patch1 > patch2;
};
