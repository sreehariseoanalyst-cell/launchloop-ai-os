import { createFileRoute, Link } from "@tanstack/react-router";

import { EmptyState, PageHeading } from "@/components/app-shell";
import { PersonCard } from "@/components/person-card";
import { ProfileCompletionCard } from "@/components/profile-completion-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { timeAgo } from "@/lib/profile";
import {
  EMPTY_FILTERS,
  useCertifications,
  useConnections,
  useConversations,
  useDiscover,
  useMyProfile,
  useNotifications,
  useSendConnection,
} from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your LaunchLoop home" },
      { name: "description", content: "Your network at a glance: connections, requests, unread messages and profile completion." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { data: profile } = useMyProfile(user?.id);
  const { data: certs } = useCertifications(user?.id);
  const { data: connections } = useConnections(user?.id);
  const { data: conversations } = useConversations(user?.id);
  const { data: notifications } = useNotifications(user?.id);
  const { data: discover } = useDiscover(EMPTY_FILTERS, user?.id);
  const connect = useSendConnection(user?.id);

  const accepted = (connections ?? []).filter((c) => c.status === "accepted");
  const pending = (connections ?? []).filter((c) => c.status === "pending" && c.receiver_id === user?.id);
  const unread = (conversations ?? []).reduce((s, c) => s + c.unread, 0);
  const relatedIds = new Set((connections ?? []).flatMap((c) => [c.sender_id, c.receiver_id]));

  const suggestions = (discover?.people ?? [])
    .filter((p) => !relatedIds.has(p.id))
    .map((p) => {
      const sharedSkills = p.skills.filter((s) => (profile?.skills ?? []).includes(s));
      const sameLocation = !!p.location && p.location === profile?.location;
      const sameOrg = !!p.organization && p.organization === profile?.organization;
      const score = sharedSkills.length * 2 + (sameLocation ? 1 : 0) + (sameOrg ? 1 : 0);
      const reasons = [...sharedSkills, sameLocation ? p.location! : null, sameOrg ? p.organization! : null].filter(Boolean);
      return { person: p, score, reason: reasons.length ? `You both have: ${reasons.join(" · ")}` : undefined };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = (profile?.full_name || "there").split(" ")[0];

  return (
    <div className="space-y-6">
      <PageHeading title={`${greeting}, ${firstName} 👋`} description="Here's what's happening in your network." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Connections" value={accepted.length} to="/connections" />
        <Stat label="Pending requests" value={pending.length} to="/connections" />
        <Stat label="Unread messages" value={unread} to="/messages" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Suggested for you</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/discover">Discover people</Link>
              </Button>
            </div>
            {suggestions.length === 0 ? (
              <EmptyState
                title="No suggestions yet"
                description="As more people join and complete their profiles, we'll suggest people who share your skills, location or college."
                action={<Button asChild><Link to="/discover">Discover people</Link></Button>}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {suggestions.map(({ person, reason }) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    reason={reason}
                    action={
                      <Button size="sm" className="flex-1" disabled={connect.isPending} onClick={() => connect.mutate(person.id)}>
                        {connect.isPending ? "Sending…" : "Connect"}
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </section>

          <section className="soft-card p-5">
            <h2 className="font-display text-lg font-semibold">Recent activity</h2>
            {(notifications ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Nothing has happened yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {(notifications ?? []).slice(0, 6).map((n) => (
                  <li key={n.id} className="flex items-center justify-between gap-3 text-sm">
                    <span>{n.message}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(n.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <ProfileCompletionCard profile={profile ?? null} certificationCount={certs?.length ?? 0} />
      </div>
    </div>
  );
}

function Stat({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link to={to} className="soft-card p-4 transition-colors hover:bg-muted/40">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-display text-3xl font-semibold">{value}</p>
    </Link>
  );
}
