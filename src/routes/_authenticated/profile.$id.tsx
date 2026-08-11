import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Github, Globe, Linkedin, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState, PageHeading } from "@/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { experienceLabel, initials } from "@/lib/profile";
import {
  getOrCreateConversation,
  useCertifications,
  useConnections,
  useProfile,
  useRespondConnection,
  useSendConnection,
} from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/profile/$id")({
  head: () => ({
    meta: [
      { title: "Profile — LaunchLoop" },
      { name: "description", content: "View a LaunchLoop member's skills, experience and availability." },
    ],
  }),
  component: ProfileViewPage,
});

function ProfileViewPage() {
  const { id } = useParams({ from: "/_authenticated/profile/$id" });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile(id);
  const { data: certs } = useCertifications(id);
  const { data: connections } = useConnections(user?.id);
  const connect = useSendConnection(user?.id);
  const respond = useRespondConnection();
  const [opening, setOpening] = useState(false);

  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (!profile) return <EmptyState title="Profile not found" description="This person may have removed their profile or made it private." />;

  const conn = (connections ?? []).find((c) => c.sender_id === id || c.receiver_id === id);
  const isMe = user?.id === id;

  const openChat = async () => {
    if (!user) return;
    setOpening(true);
    try {
      const conversationId = await getOrCreateConversation(user.id, id);
      navigate({ to: "/messages/$conversationId", params: { conversationId } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open conversation");
    } finally {
      setOpening(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeading title="Profile" />
      <div className="soft-card p-6">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar className="size-20">
            {profile.avatar_url ? <AvatarImage src={profile.avatar_url} alt="" /> : null}
            <AvatarFallback className="bg-accent text-accent-foreground text-lg">{initials(profile.full_name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-semibold">{profile.full_name || "Unnamed"}</h2>
            <p className="text-muted-foreground">{profile.primary_role || "Member"}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {profile.location && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{profile.location}</span>}
              <span>{experienceLabel(profile.experience_years)}</span>
              {profile.organization && <span>{profile.organization}</span>}
              {profile.qualification && <span>{profile.qualification}</span>}
              {profile.availability && <Badge variant="secondary">{profile.availability}</Badge>}
            </div>
          </div>
          {!isMe && (
            <div className="flex flex-wrap gap-2">
              {conn?.status === "accepted" ? (
                <>
                  <Button variant="secondary" disabled>Connected</Button>
                  <Button onClick={openChat} disabled={opening}>{opening ? "Opening…" : "Message"}</Button>
                </>
              ) : conn?.status === "pending" && conn.receiver_id === user?.id ? (
                <>
                  <Button disabled={respond.isPending} onClick={() => respond.mutate({ id: conn.id, status: "accepted" })}>Accept request</Button>
                  <Button variant="outline" disabled={respond.isPending} onClick={() => respond.mutate({ id: conn.id, status: "rejected" })}>Reject</Button>
                </>
              ) : conn?.status === "pending" ? (
                <Button variant="secondary" disabled>Request sent</Button>
              ) : (
                <Button disabled={connect.isPending} onClick={() => connect.mutate(id)}>
                  {connect.isPending ? "Sending…" : "Connect"}
                </Button>
              )}
            </div>
          )}
        </div>

        {profile.bio && <p className="mt-5 text-sm">{profile.bio}</p>}

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Section title="Skills" values={profile.skills} />
          <Section title="Languages" values={profile.languages} />
          <Section title="Interests" values={profile.interests} />
          <div>
            <h3 className="text-sm font-semibold">Certifications</h3>
            {certs && certs.length > 0 ? (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {certs.map((c) => <li key={c.id}>{[c.name, c.issuer, c.year].filter(Boolean).join(" · ")}</li>)}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">None listed.</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          {profile.portfolio_url && <a className="flex items-center gap-1 text-primary hover:underline" href={profile.portfolio_url} target="_blank" rel="noreferrer"><Globe className="size-4" />Portfolio</a>}
          {profile.linkedin_url && <a className="flex items-center gap-1 text-primary hover:underline" href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin className="size-4" />LinkedIn</a>}
          {profile.github_url && <a className="flex items-center gap-1 text-primary hover:underline" href={profile.github_url} target="_blank" rel="noreferrer"><Github className="size-4" />GitHub</a>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {values.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((v) => <Badge key={v} variant="outline" className="font-normal">{v}</Badge>)}
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">None listed.</p>
      )}
    </div>
  );
}
