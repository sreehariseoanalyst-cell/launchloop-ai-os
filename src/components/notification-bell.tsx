import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { timeAgo } from "@/lib/profile";
import { useMarkNotifications } from "@/lib/queries";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
};

export function NotificationBell({
  notifications,
  userId,
}: {
  notifications: Notification[];
  userId?: string | undefined;
}) {
  const mark = useMarkNotifications(userId);
  const unread = notifications.filter((n) => !n.is_read).length;

  const linkFor = (n: Notification) => {
    if (n.type === "message") return "/messages";
    if (n.type === "connection_request") return "/connections";
    return "/connections";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <button
              className="text-xs text-primary hover:underline"
              onClick={() => mark.mutate("all")}
              disabled={mark.isPending}
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              You have no notifications yet.
            </p>
          ) : (
            notifications.slice(0, 12).map((n) => (
              <Link
                key={n.id}
                to={linkFor(n)}
                onClick={() => !n.is_read && mark.mutate([n.id])}
                className={cn(
                  "block border-b border-border px-3 py-2.5 last:border-0 hover:bg-muted",
                  !n.is_read && "bg-accent/50",
                )}
              >
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</p>
              </Link>
            ))
          )}
        </div>
        <div className="border-t border-border p-2">
          <Link to="/notifications" className="block rounded-md px-2 py-1.5 text-center text-xs text-primary hover:bg-muted">
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
