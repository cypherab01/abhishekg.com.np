/**
 * Spam bots like to forge a sender at the domain they are mailing
 * (sales@example.com), so the contact form rejects addresses that claim to be
 * at this site's own domain — a real visitor never needs one.
 *
 * `appUrl` is passed in rather than read from the environment so the rule can
 * be exercised directly in tests.
 */
export function ownDomain(appUrl: string | undefined): string | null {
  if (!appUrl) return null;
  try {
    const host = new URL(appUrl).hostname.toLowerCase().replace(/^www\./, "");
    return host || null;
  } catch {
    return null;
  }
}

/** True when `email` is at the site's domain, or any subdomain of it. */
export function isOwnDomainEmail(
  email: string,
  appUrl: string | undefined,
): boolean {
  const domain = ownDomain(appUrl);
  if (!domain) return false;
  const sender = email.split("@")[1]?.toLowerCase().trim();
  if (!sender) return false;
  return sender === domain || sender.endsWith(`.${domain}`);
}
