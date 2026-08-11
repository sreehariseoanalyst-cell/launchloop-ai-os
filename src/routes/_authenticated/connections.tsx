import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState, PageHeading } from "@/components/app-shell";
import { PersonCard } from "@/components/person-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import type { Profile } from "@/lib/profile";
import { getOrCreateConversation, useConnections, useProfilesByIds, useRespondConnection } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/connections")({
  head: () => ({
    meta: [
      { title: "Connections — LaunchLoop" },
      { name: "description", content: "Manage your LaunchLoop connections, pending requests and sent requests." },
    ],
  }),
  component: ConnectionsPage,
});

function ConnectionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: connections, isLoading } = useConnections(user?.id);
  const respond = useRespondConnection();
  const [busy, setBusy] = useState<string | null>(null);

  const rows = connections ?? [];
  const otherId = (r: { sender_id: string; receiver_id: string }) => (r.sender_id === user?.id ? r.receiver_id : r.sender_id);
  const ids = rows.map(otherId);
  const { data: profiles } = useProfilesByIds(ids);
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  const accepted = rows.filter((r) => r.status === "accepted");
  const incoming = rows.filter((r) => r.status === "pending" && r.receiver_id === user?.id);
  const outgoing = rows.filter((r) => r.status === "pending" && r.sender_id === user?.id);

  const message = async (id: string) => {
    if (!user) return;
    setBusy(id);
    try {
      const conversationId = await getOrCreateConversation(user.id, id);
      navigate({ to: "/messages/$conversationId", params: { conversationId } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open conversation");
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;

  const grid = (list: typeof rows, action: (p: Profile, rowId: string) => React.ReactNode) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((r) => {
        const p = byId.get(otherId(r));
        if (!p) return null;
        return <PersonCard key={r.id} person={p} action={action(p, r.id)} />;
      })}
    </div>
  );

  return (
    <div className="space-y-8">
      <PageHeading title="Connections" description="Requests you've received, requests you've sent and your network." />

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Pending requests ({incoming.length})</h2>
        {incoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending requests right now.</p>
        ) : (
          grid(incoming, (_p, rowId) => (
            <div className="flex flex-1 gap-2">
              <Button size="sm" className="flex-1" disabled={respond.isPending} onClick={() => respond.mutate({ id: rowId, status: "accepted" })}>Accept</Button>
              <Button size="sm" variant="outline" className="flex-1" disabled={respond.isPending} onClick={() => respond.mutate({ id: rowId, status: "rejected" })}>Reject</Button>
            </div>
          ))
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Sent requests ({outgoing.length})</h2>
        {outgoing.length === 0 ? (
          <p className="text-sm text-muted-foreground">You haven't sent any pending requests.</p>
        ) : (
          grid(outgoing, () => <Button size="sm" variant="secondary" className="flex-1" disabled>Request sent</Button>)
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">My connections ({accepted.length})</h2>
        {accepted.length === 0 ? (
          <EmptyState
            title="No connections yet"
            description="Start building your network by discovering people with skills that match your interests."
            action={<Button asChild><Link to="/discover">Discover people</Link></Button>}
          />
        ) : (
          grid(accepted, (p) => (
            <Button size="sm" className="flex-1" disabled={busy === p.id} onClick={() => void message(p.id)}>
              {busy === p.id ? "Opening…" : "Message"}
            </Button>
          ))
        )}
      </section>
    </div>
  );
}
