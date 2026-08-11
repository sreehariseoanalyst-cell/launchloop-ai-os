import { createFileRoute, Link } from "@tanstack/react-router";

import { EmptyState, PageHeading } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { timeAgo } from "@/lib/profile";
import { useMarkNotifications, useNotifications } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — LaunchLoop" },
      { name: "description", content: "Connection requests, acceptances and new messages." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useNotifications(user?.id);
  const mark = useMarkNotifications(user?.id);
  const unread = (data ?? []).filter((n) => !n.is_read).length;

  return (
    <div className="space-y-5">
      <PageHeading
        title="Notifications"
        description="Everything that happened in your network."
        action={unread > 0 ? <Button variant="outline" size="sm" onClick={() => mark.mutate("all")} disabled={mark.isPending}>Mark all as read</Button> : undefined}
      />
      {isLoading ? (
        <Skeleton className="h-60 w-full rounded-xl" />
      ) : (data ?? []).length === 0 ? (
        <EmptyState title="No notifications" description="When someone connects with you or sends a message, it will appear here." />
      ) : (
        <div className="soft-card divide-y divide-border overflow-hidden">
          {data!.map((n) => (
            <Link
              key={n.id}
              to={n.type === "message" ? "/messages" : "/connections"}
              onClick={() => !n.is_read && mark.mutate([n.id])}
              className={cn("block px-4 py-3 hover:bg-muted/50", !n.is_read && "bg-accent/40")}
            >
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
