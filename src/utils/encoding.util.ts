export const Base64url = {
  encode: function (buffer: Buffer): string {
    let base64 = buffer.toString("base64");
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const padding = (4 - (base64.length % 4)) % 4;
    return base64 + "=".repeat(padding);
  },

  decode: function (text: string): Buffer {
    let base64 = text.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (base64.length % 4)) % 4;
    base64 += "=".repeat(padding);
    return Buffer.from(base64, "base64");
  },
};
