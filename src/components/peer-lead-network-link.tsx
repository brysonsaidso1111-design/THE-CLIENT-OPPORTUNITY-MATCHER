import Link from "next/link";

function configuredInviteUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_PEER_LEAD_NETWORK_URL;
  if (!value) return null;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

/** Keep community promotion separate from discovery and verdict logic. */
export function PeerLeadNetworkLink() {
  const inviteUrl = configuredInviteUrl();
  if (!inviteUrl) return null;

  return (
    <aside className="peer-network-link" aria-label="T4L Peer Lead Network">
      <div className="peer-network-link__copy">
        <p className="peer-network-link__eyebrow">T4L GROWTH™ COMMUNITY</p>
        <h2>Share the Peer Lead Network</h2>
        <p>Connect with serious freelancers, collaborate, and exchange relevant leads.</p>
      </div>
      <Link className="peer-network-link__action" href={inviteUrl} target="_blank" rel="noopener noreferrer">
        Share the Peer Lead Network <span aria-hidden="true">↗</span>
      </Link>
    </aside>
  );
}
