import { createCipheriv, createDecipheriv } from "browserify-cipher";
import createHash from "create-hash";
import { pbkdf2Sync } from "pbkdf2";

import { HashAlgorithm } from "@/enums/security.enum";

import { Base64url } from "./encoding.util";

export function hash(algorithm: HashAlgorithm, value: string): string {
  return createHash(algorithm).update(value).digest("hex");
}

export function pbkdf2(
  value: string,
  salt: string,
  iteration: number,
  keyLen: number = 32,
  algorithm: string = HashAlgorithm.SHA512,
): string {
  return Base64url.encode(
    pbkdf2Sync(
      value,
      hash(HashAlgorithm.SHA256, salt),
      iteration,
      keyLen,
      algorithm,
    ),
  );
}

export function encrypt(text: string, password: string): string {
  const cipher = createCipheriv(
    "aes-256-cbc",
    Base64url.decode(password),
    Buffer.alloc(16, 0),
  );
  return Base64url.encode(
    Buffer.concat([cipher.update(text, "utf8"), cipher.final()]),
  );
}

export function decrypt(text: string, password: string): string {
  const decipher = createDecipheriv(
    "aes-256-cbc",
    Base64url.decode(password),
    Buffer.alloc(16, 0),
  );
  return Buffer.concat([
    decipher.update(Base64url.decode(text)),
    decipher.final(),
  ]).toString("utf8");
}
