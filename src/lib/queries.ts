import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/profile";

export type ConnectionRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
};

export const PROFILE_COLUMNS =
  "id, full_name, avatar_url, bio, location, organization, qualification, experience_years, primary_role, skills, languages, interests, availability, portfolio_url, linkedin_url, github_url, onboarded, is_visible, show_email, email_notifications, created_at, updated_at";

/* ---------------- profile ---------------- */

export function useMyProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useProfile(id?: string) {
  return useQuery({
    queryKey: ["profile", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useCertifications(profileId?: string) {
  return useQuery({
    queryKey: ["certifications", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("profile_id", profileId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

/* ---------------- discover ---------------- */

export type DiscoverFilters = {
  search: string;
  skill: string;
  location: string;
  availability: string;
  qualification: string;
  language: string;
  minExperience: string;
};

export const EMPTY_FILTERS: DiscoverFilters = {
  search: "",
  skill: "",
  location: "",
  availability: "",
  qualification: "",
  language: "",
  minExperience: "",
};

export function useDiscover(filters: DiscoverFilters, myId?: string) {
  return useQuery({
    queryKey: ["discover", filters, myId],
    enabled: !!myId,
    queryFn: async () => {
      let q = supabase
        .from("profiles")
        .select(PROFILE_COLUMNS, { count: "exact" })
        .eq("is_visible", true)
        .neq("id", myId!);

      const term = filters.search.trim();
      if (term) {
        const like = `%${term}%`;
        q = q.or(
          `full_name.ilike.${like},primary_role.ilike.${like},organization.ilike.${like},location.ilike.${like},bio.ilike.${like}`,
        );
      }
      if (filters.skill.trim()) q = q.contains("skills", [filters.skill.trim()]);
      if (filters.language.trim()) q = q.contains("languages", [filters.language.trim()]);
      if (filters.location.trim()) q = q.ilike("location", `%${filters.location.trim()}%`);
      if (filters.availability) q = q.eq("availability", filters.availability);
      if (filters.qualification) q = q.eq("qualification", filters.qualification);
      if (filters.minExperience) q = q.gte("experience_years", Number(filters.minExperience));

      const { data, error, count } = await q.order("updated_at", { ascending: false }).limit(60);
      if (error) throw error;
      return { people: (data ?? []) as Profile[], count: count ?? 0 };
    },
  });
}

/* ---------------- connections ---------------- */

export function useConnections(userId?: string) {
  return useQuery({
    queryKey: ["connections", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("connections")
        .select("id, sender_id, receiver_id, status, created_at")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ConnectionRow[];
    },
  });
}

export function useProfilesByIds(ids: string[]) {
  const key = [...ids].sort().join(",");
  return useQuery({
    queryKey: ["profiles-by-ids", key],
    enabled: ids.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select(PROFILE_COLUMNS).in("id", ids);
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
  });
}

export function useSendConnection(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (receiverId: string) => {
      if (!userId) throw new Error("You must be signed in.");
      if (userId === receiverId) throw new Error("You cannot connect with yourself.");
      const { error } = await supabase
        .from("connections")
        .insert({ sender_id: userId, receiver_id: receiverId, status: "pending" });
      if (error) {
        if (error.code === "23505") throw new Error("A connection request already exists.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Connection request sent");
      void qc.invalidateQueries({ queryKey: ["connections"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRespondConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "rejected" }) => {
      const { error } = await supabase.from("connections").update({ status }).eq("id", id);
      if (error) throw error;
      return status;
    },
    onSuccess: (status) => {
      toast.success(status === "accepted" ? "Connection accepted" : "Request rejected");
      void qc.invalidateQueries({ queryKey: ["connections"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

/* ---------------- notifications ---------------- */

export function useNotifications(userId?: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => {
          void qc.invalidateQueries({ queryKey: ["notifications", userId] });
          void qc.invalidateQueries({ queryKey: ["connections", userId] });
          void qc.invalidateQueries({ queryKey: ["conversations", userId] });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, qc]);

  return query;
}

export function useMarkNotifications(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[] | "all") => {
      let q = supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
      if (ids !== "all") q = q.in("id", ids);
      const { error } = await q;
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["notifications", userId] }),
    onError: (e: Error) => toast.error(e.message),
  });
}

/* ---------------- messaging ---------------- */

export type ConversationSummary = {
  id: string;
  otherUser: Profile | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unread: number;
};

export function useConversations(userId?: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["conversations", userId],
    enabled: !!userId,
    queryFn: async (): Promise<ConversationSummary[]> => {
      const { data: memberships, error: mErr } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq("user_id", userId!);
      if (mErr) throw mErr;
      const ids = (memberships ?? []).map((m) => m.conversation_id);
      if (!ids.length) return [];

      const [convRes, othersRes, msgRes] = await Promise.all([
        supabase.from("conversations").select("id, last_message_at").in("id", ids),
        supabase
          .from("conversation_members")
          .select("conversation_id, user_id")
          .in("conversation_id", ids)
          .neq("user_id", userId!),
        supabase
          .from("messages")
          .select("id, conversation_id, sender_id, message, created_at, read_at")
          .in("conversation_id", ids)
          .order("created_at", { ascending: false }),
      ]);
      if (convRes.error) throw convRes.error;
      if (othersRes.error) throw othersRes.error;
      if (msgRes.error) throw msgRes.error;

      const otherIds = (othersRes.data ?? []).map((o) => o.user_id);
      const profiles = otherIds.length
        ? ((await supabase.from("profiles").select(PROFILE_COLUMNS).in("id", otherIds)).data ?? [])
        : [];

      return (convRes.data ?? [])
        .map((c) => {
          const otherId = (othersRes.data ?? []).find((o) => o.conversation_id === c.id)?.user_id;
          const msgs = (msgRes.data ?? []).filter((m) => m.conversation_id === c.id);
          return {
            id: c.id,
            otherUser: (profiles as Profile[]).find((p) => p.id === otherId) ?? null,
            lastMessage: msgs[0]?.message ?? null,
            lastMessageAt: c.last_message_at,
            unread: msgs.filter((m) => m.sender_id !== userId && !m.read_at).length,
          };
        })
        .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
    },
  });

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`conv-list-${userId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        void qc.invalidateQueries({ queryKey: ["conversations", userId] });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, qc]);

  return query;
}

export async function getOrCreateConversation(userId: string, otherId: string) {
  const { data: mine, error: e1 } = await supabase
    .from("conversation_members")
    .select("conversation_id")
    .eq("user_id", userId);
  if (e1) throw e1;
  const ids = (mine ?? []).map((m) => m.conversation_id);
  if (ids.length) {
    const { data: shared, error: e2 } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", otherId)
      .in("conversation_id", ids);
    if (e2) throw e2;
    if (shared?.length) return shared[0]!.conversation_id;
  }
  const { data: conv, error: e3 } = await supabase
    .from("conversations")
    .insert({ created_by: userId })
    .select("id")
    .single();
  if (e3) throw e3;
  const { error: e4 } = await supabase.from("conversation_members").insert([
    { conversation_id: conv.id, user_id: userId },
    { conversation_id: conv.id, user_id: otherId },
  ]);
  if (e4) throw e4;
  return conv.id;
}
