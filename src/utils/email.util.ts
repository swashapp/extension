const EmailProviders: Record<
  string,
  {
    domain: string;
    aliases: string[];
    transform?: (user: string) => string;
  }
> = {
  google: {
    domain: "gmail.com",
    aliases: ["googlemail.com"],
    transform: (user) => user.replace(/\./g, ""),
  },
  apple: {
    domain: "icloud.com",
    aliases: ["me.com", "mac.com"],
  },
  proton: {
    domain: "protonmail.com",
    aliases: ["proton.me"],
  },
  fastmail: {
    domain: "fastmail.com",
    aliases: ["fastmail.fm"],
  },
};

export function normalizeEmail(email: string): string {
  let [user, domain] = email.toLowerCase().split("@");
  user = user.split("+")[0];

  for (const service of Object.values(EmailProviders)) {
    if (service.aliases.includes(domain) || service.domain === domain) {
      if (service.transform) user = service.transform(user);
      domain = service.domain;
    }
  }

  return `${user.split("+")[0]}@${domain}`;
}
