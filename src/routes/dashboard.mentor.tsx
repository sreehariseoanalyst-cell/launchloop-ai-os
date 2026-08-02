import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, MessageSquare, Star } from "lucide-react";

import { PageHeading } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mentorStartups } from "@/lib/launchloop-data";

export const Route = createFileRoute("/dashboard/mentor")({
  head: () => ({
    meta: [
      { title: "Mentor Dashboard — LaunchLoop" },
      {
        name: "description",
        content:
          "Review assigned startups, validate milestones, schedule sessions and rate founder progress.",
      },
      { property: "og:title", content: "Mentor Dashboard — LaunchLoop" },
      {
        property: "og:description",
        content: "Validate milestones and guide founders with structured reviews.",
      },
    ],
  }),
  component: MentorDashboard,
});

const validations = [
  { startup: "MediTriage AI", milestone: "Business model canvas v2", submitted: "2 days ago" },
  { startup: "MediTriage AI", milestone: "Prototype v0.4 demo", submitted: "4 days ago" },
  { startup: "Kelp Labs", milestone: "Market research report", submitted: "Today" },
];

function MentorDashboard() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeading
        title="Dr. Anand Krishnan"
        description="Healthtech & regulatory mentor · 3 assigned startups · 4.9 founder rating"
        action={
          <Button className="bg-gradient-brand text-brand-foreground">
            <CalendarDays className="size-4" /> Schedule session
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {mentorStartups.map((s) => (
          <div key={s.name} className="glass shadow-soft rounded-3xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-muted-foreground text-xs">{s.stage}</p>
              </div>
              {s.pending > 0 ? (
                <Badge className="bg-gradient-brand text-brand-foreground">
                  {s.pending} pending
                </Badge>
              ) : (
                <Badge variant="secondary">Up to date</Badge>
              )}
            </div>
            <Progress value={s.progress} className="mt-4 h-1.5" />
            <p className="text-muted-foreground mt-2 text-xs">
              {s.progress}% journey · last review {s.lastReview}
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <MessageSquare className="size-3.5" /> Chat
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Review
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Milestone validation queue</h2>
          <div className="mt-4 space-y-3">
            {validations.map((v) => (
              <div
                key={v.milestone}
                className="bg-surface-2/60 flex items-center gap-3 rounded-2xl p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{v.milestone}</p>
                  <p className="text-muted-foreground text-xs">
                    {v.startup} · submitted {v.submitted}
                  </p>
                </div>
                <Button size="sm" className="bg-gradient-brand text-brand-foreground ml-auto">
                  <CheckCircle2 className="size-3.5" /> Approve
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Founder ratings & feedback</h2>
          <div className="mt-4 space-y-3">
            {[
              { name: "Nikhil Verma", rating: 4.8, note: "Ships fast, needs sharper unit economics." },
              { name: "Meera Das", rating: 4.4, note: "Strong research, slow on customer calls." },
              { name: "Rahul Sen", rating: 4.6, note: "Great storyteller; deck needs traction slide." },
            ].map((f) => (
              <div key={f.name} className="bg-surface-2/60 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{f.name}</p>
                  <span className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
                    <Star className="size-3.5" /> {f.rating}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}