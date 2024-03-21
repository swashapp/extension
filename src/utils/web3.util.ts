import { isAddress } from "ethers";

import { Any } from "@/types/any.type";

function isBigInt(value: string): boolean {
  try {
    BigInt(value);
    return true;
  } catch (error) {
    return false;
  }
}

export function getSolidityType(value: Any): string {
  if (typeof value === "string") {
    if (isAddress(value)) {
      return "address";
    } else if (isBigInt(value)) {
      return "uint256";
    } else {
      return "string";
    }
  } else if (typeof value === "number" || typeof value === "bigint") {
    return "uint256";
  } else if (typeof value === "boolean") {
    return "bool";
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new Error("Failed to find value type");
    }
    const elementType = getSolidityType(value[0]);
    return `${elementType}[]`;
  } else {
    throw new Error(`Type of ${value} is not supported`);
  }
}
