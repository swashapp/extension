function regExpEscape(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

export function regex(input: string, regex: string) {
  return !!input.match(regex);
}

export function wildcard(input: string, wildcard: string) {
  const regex = new RegExp(
    "^" + wildcard.split(/\*+/).map(regExpEscape).join(".*") + "$",
  );
  return !!input.match(regex);
}
