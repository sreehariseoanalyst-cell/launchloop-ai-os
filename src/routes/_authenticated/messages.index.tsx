import { createFileRoute, Link } from "@tanstack/react-router";

import { EmptyState, PageHeading } from "@/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { initials, timeAgo } from "@/lib/profile";
import { useConversations } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/messages/")({
  head: () => ({
    meta: [
      { title: "Messages — LaunchLoop" },
      { name: "description", content: "Your 1-to-1 conversations with people you're connected to." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { user } = useAuth();
  const { data: conversations, isLoading, isError, error } = useConversations(user?.id);

  return (
    <div className="space-y-5">
      <PageHeading title="Messages" description="Talk directly with people in your network." />
      {isError && <p className="text-sm text-destructive">{(error as Error).message}</p>}
      {isLoading ? (
        <Skeleton className="h-60 w-full rounded-xl" />
      ) : (conversations ?? []).length === 0 ? (
        <EmptyState
          title="No conversations yet"
          description="Connect with someone first to start a conversation."
          action={<Button asChild><Link to="/discover">Discover people</Link></Button>}
        />
      ) : (
        <div className="soft-card divide-y divide-border overflow-hidden">
          {conversations!.map((c) => (
            <Link key={c.id} to="/messages/$conversationId" params={{ conversationId: c.id }} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50">
              <Avatar className="size-10">
                {c.otherUser?.avatar_url ? <AvatarImage src={c.otherUser.avatar_url} alt="" /> : null}
                <AvatarFallback className="bg-accent text-accent-foreground text-xs">{initials(c.otherUser?.full_name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.otherUser?.full_name || "Unknown"}</p>
                <p className="truncate text-xs text-muted-foreground">{c.lastMessage ?? "No messages yet"}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] text-muted-foreground">{timeAgo(c.lastMessageAt)}</span>
                {c.unread > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">{c.unread}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
