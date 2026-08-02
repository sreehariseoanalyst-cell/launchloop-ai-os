import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Users } from "lucide-react";
import { useState } from "react";

import { PageHeading } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { teamMatches } from "@/lib/launchloop-data";

export const Route = createFileRoute("/dashboard/ai-team")({
  head: () => ({
    meta: [
      { title: "AI Team Formation Engine — LaunchLoop" },
      {
        name: "description",
        content:
          "Describe your startup and get ranked co-builders with compatibility scores based on skills, college, availability and past projects.",
      },
      { property: "og:title", content: "AI Team Formation Engine — LaunchLoop" },
      {
        property: "og:description",
        content: "Ranked co-founder and teammate matches with explainable compatibility.",
      },
    ],
  }),
  component: AiTeamPage,
});

function AiTeamPage() {
  const [idea, setIdea] = useState("I am building an AI healthcare startup for clinic triage.");
  const [generated, setGenerated] = useState(true);

  return (
    <div className="space-y-6 pb-10">
      <PageHeading
        title="AI team formation engine"
        description="Describe the startup. The engine ranks people by skills, college, location, availability and proven work."
      />

      <div className="glass shadow-soft rounded-3xl p-6">
        <label className="text-sm font-medium" htmlFor="idea">
          Your startup in one line
        </label>
        <Textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={3}
          className="mt-2 resize-none"
        />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            className="bg-gradient-brand text-brand-foreground"
            onClick={() => setGenerated(true)}
          >
            <Sparkles className="size-4" /> Recommend my team
          </Button>
          <span className="text-muted-foreground text-xs">
            Roles inferred: Flutter Developer · Backend Developer · UI Designer · Marketing Lead ·
            Business Strategist · Legal Advisor
          </span>
        </div>
      </div>

      {generated ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teamMatches.map((m) => (
            <div key={m.name} className="glass shadow-soft rounded-3xl p-5">
              <div className="flex items-start gap-3">
                <span className="bg-gradient-brand text-brand-foreground grid size-10 shrink-0 place-items-center rounded-2xl text-sm font-semibold">
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{m.name}</p>
                  <p className="text-muted-foreground text-xs">{m.role}</p>
                </div>
                <span className="text-gradient font-display ml-auto text-2xl font-semibold">
                  {m.compat}%
                </span>
              </div>
              <Progress value={m.compat} className="mt-4 h-1.5" />
              <p className="text-muted-foreground mt-3 text-xs">
                {m.college} · {m.availability}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.reasons.map((r) => (
                  <Badge key={r} variant="secondary" className="text-[11px]">
                    {r}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="bg-gradient-brand text-brand-foreground flex-1">
                  <Users className="size-3.5" /> Invite
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}