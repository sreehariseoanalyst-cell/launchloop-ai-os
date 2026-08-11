import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { initials, type Profile } from "@/lib/profile";
import { PROFILE_COLUMNS } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/messages/$conversationId")({
  head: () => ({
    meta: [
      { title: "Conversation — LaunchLoop" },
      { name: "description", content: "Real-time 1-to-1 conversation on LaunchLoop." },
    ],
  }),
  component: ConversationPage,
});

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  read_at: string | null;
};

function ConversationPage() {
  const { conversationId } = useParams({ from: "/_authenticated/messages/$conversationId" });
  const { user } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_id, message, created_at, read_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  const other = useQuery({
    queryKey: ["conversation-other", conversationId, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversation_members")
        .select("user_id")
        .eq("conversation_id", conversationId)
        .neq("user_id", user!.id);
      if (error) throw error;
      const id = data?.[0]?.user_id;
      if (!id) return null;
      const res = await supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", id).maybeSingle();
      if (res.error) throw res.error;
      return res.data as Profile | null;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        () => {
          void qc.invalidateQueries({ queryKey: ["messages", conversationId] });
          void qc.invalidateQueries({ queryKey: ["conversations", user?.id] });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId, qc, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    const unread = (messages.data ?? []).filter((m) => m.sender_id !== user?.id && !m.read_at);
    if (unread.length) {
      void supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .in("id", unread.map((m) => m.id))
        .then(() => qc.invalidateQueries({ queryKey: ["conversations", user?.id] }));
    }
  }, [messages.data, user?.id, qc]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !user) return;
    setSending(true);
    const { error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: user.id, message: text });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDraft("");
    void qc.invalidateQueries({ queryKey: ["messages", conversationId] });
  };

  return (
    <div className="soft-card flex h-[calc(100vh-11rem)] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Button asChild variant="ghost" size="icon" className="lg:hidden" aria-label="Back">
          <Link to="/messages"><ArrowLeft className="size-4" /></Link>
        </Button>
        <Avatar className="size-9">
          {other.data?.avatar_url ? <AvatarImage src={other.data.avatar_url} alt="" /> : null}
          <AvatarFallback className="bg-accent text-accent-foreground text-xs">{initials(other.data?.full_name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{other.data?.full_name || "Conversation"}</p>
          <p className="truncate text-xs text-muted-foreground">{other.data?.primary_role || ""}</p>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {messages.isLoading ? (
          <Skeleton className="h-24 w-full rounded-lg" />
        ) : messages.isError ? (
          <p className="text-sm text-destructive">{(messages.error as Error).message}</p>
        ) : (messages.data ?? []).length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No messages yet. Say hello.</p>
        ) : (
          messages.data!.map((m) => {
            const mine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] rounded-2xl px-3 py-2 text-sm", mine ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  <p className="whitespace-pre-wrap">{m.message}</p>
                  <p className={cn("mt-1 text-[10px]", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {mine && m.read_at ? " · Read" : ""}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form className="flex gap-2 border-t border-border p-3" onSubmit={send}>
        <Input placeholder="Type a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <Button type="submit" disabled={sending || !draft.trim()}>
          <Send className="size-4" /> {sending ? "Sending…" : "Send"}
        </Button>
      </form>
    </div>
  );
}
