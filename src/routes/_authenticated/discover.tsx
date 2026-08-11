import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { EmptyState, PageHeading } from "@/components/app-shell";
import { PersonCard } from "@/components/person-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { AVAILABILITY_OPTIONS, QUALIFICATION_OPTIONS } from "@/lib/profile";
import { EMPTY_FILTERS, useConnections, useDiscover, useSendConnection, type DiscoverFilters } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/discover")({
  head: () => ({
    meta: [
      { title: "Discover people — LaunchLoop" },
      { name: "description", content: "Search and filter people by skill, location, availability, qualification and language." },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [filters, setFilters] = useState<DiscoverFilters>(EMPTY_FILTERS);
  const { data, isLoading, isError, error } = useDiscover(filters, user?.id);
  const { data: connections } = useConnections(user?.id);
  const connect = useSendConnection(user?.id);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, search: input })), 350);
    return () => clearTimeout(t);
  }, [input]);

  const statusWith = (id: string) => (connections ?? []).find((c) => c.sender_id === id || c.receiver_id === id);

  const set = (key: keyof DiscoverFilters, value: string) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-5">
      <PageHeading title="Discover people" description="Find people by skills, location, availability and more." />

      <div className="soft-card space-y-4 p-4">
        <Input placeholder="Search by name, role, college or location…" value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label className="text-xs">Skill</Label>
            <Input className="mt-1" placeholder="Python" value={filters.skill} onChange={(e) => set("skill", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Location</Label>
            <Input className="mt-1" placeholder="Coimbatore" value={filters.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Language</Label>
            <Input className="mt-1" placeholder="Tamil" value={filters.language} onChange={(e) => set("language", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Availability</Label>
            <Select value={filters.availability} onValueChange={(v) => set("availability", v)}>
              <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent>{AVAILABILITY_OPTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Qualification</Label>
            <Select value={filters.qualification} onValueChange={(v) => set("qualification", v)}>
              <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent>{QUALIFICATION_OPTIONS.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Minimum experience</Label>
            <Select value={filters.minExperience} onValueChange={(v) => set("minExperience", v)}>
              <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent>
                {["1", "2", "3", "5"].map((y) => <SelectItem key={y} value={y}>{y}+ years</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Searching…" : `${data?.count ?? 0} ${data?.count === 1 ? "person" : "people"} found`}
          </p>
          <Button variant="ghost" size="sm" onClick={() => { setInput(""); setFilters(EMPTY_FILTERS); }}>
            Clear filters
          </Button>
        </div>
      </div>

      {isError && <p className="text-sm text-destructive">{(error as Error).message}</p>}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56 w-full rounded-xl" />)}
        </div>
      ) : (data?.people.length ?? 0) === 0 ? (
        <EmptyState title="No people match your filters" description="Try removing a filter or searching for a different skill." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data!.people.map((p) => {
            const conn = statusWith(p.id);
            return (
              <PersonCard
                key={p.id}
                person={p}
                action={
                  conn?.status === "accepted" ? (
                    <Button size="sm" variant="secondary" className="flex-1" disabled>Connected</Button>
                  ) : conn?.status === "pending" ? (
                    <Button size="sm" variant="secondary" className="flex-1" disabled>
                      {conn.sender_id === user?.id ? "Request sent" : "Respond"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={connect.isPending && pendingId === p.id}
                      onClick={() => { setPendingId(p.id); connect.mutate(p.id); }}
                    >
                      {connect.isPending && pendingId === p.id ? "Sending…" : "Connect"}
                    </Button>
                  )
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
