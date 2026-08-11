import { createFileRoute } from "@tanstack/react-router";
import { Award, GraduationCap, Rocket, Trophy } from "lucide-react";

import { PageHeading } from "@/components/dashboard-shell";
import { ScoreRing } from "@/components/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { leaderboard, studentProjects, studentSkills } from "@/lib/launchloop-data";

export const Route = createFileRoute("/dashboard/student")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — LaunchLoop" },
      {
        name: "description",
        content:
          "Build a verified portfolio, join startups, track contribution score, certificates, hackathons and learning progress.",
      },
      { property: "og:title", content: "Student Dashboard — LaunchLoop" },
      {
        property: "og:description",
        content: "Turn coursework and side projects into verified startup experience.",
      },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeading
        title="Ananya Iyer"
        description="B.Tech CSE · IIT Madras · Flutter, AI/ML, UI/UX · 20 hrs/week available"
        action={<Button className="bg-gradient-brand text-brand-foreground">Edit portfolio</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass shadow-soft flex flex-col items-center rounded-3xl p-6 text-center">
          <ScoreRing value={78} label="Contribution" sublabel="Top 4% on campus" />
          <div className="mt-4 flex gap-2">
            <Badge variant="secondary">
              <Trophy className="size-3" /> 2 hackathon wins
            </Badge>
            <Badge variant="secondary">
              <Award className="size-3" /> 5 certificates
            </Badge>
          </div>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Skills</h2>
          <div className="mt-4 space-y-3">
            {studentSkills.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs">
                  <span>{s.name}</span>
                  <span className="text-muted-foreground">{s.level}%</span>
                </div>
                <Progress value={s.level} className="mt-1 h-1.5" />
              </div>
            ))}
          </div>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Leaderboard</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {leaderboard.map((l, i) => (
              <li key={l.name} className="flex items-center gap-3">
                <span className="text-muted-foreground w-4 text-xs">{i + 1}</span>
                <span className={l.name === "You" ? "text-gradient font-semibold" : ""}>
                  {l.name}
                </span>
                <span className="text-muted-foreground ml-auto text-xs">{l.score} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Projects & contributions</h2>
          <div className="mt-4 space-y-3">
            {studentProjects.map((p) => (
              <div key={p.name} className="bg-surface-2/60 rounded-2xl p-3">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-muted-foreground text-xs">
                  {p.role} · {p.startup}
                </p>
                <Badge className="bg-gradient-brand text-brand-foreground mt-2">{p.impact}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Startup invitations</h2>
          <div className="mt-4 space-y-3">
            {[
              { name: "MediTriage AI", role: "Flutter Developer", match: 94 },
              { name: "Kelp Labs", role: "ML Engineer", match: 86 },
              { name: "Fintrail", role: "Frontend Developer", match: 79 },
            ].map((inv) => (
              <div
                key={inv.name}
                className="bg-surface-2/60 flex items-center gap-3 rounded-2xl p-3"
              >
                <Rocket className="text-primary size-4" />
                <div>
                  <p className="text-sm font-medium">{inv.name}</p>
                  <p className="text-muted-foreground text-xs">{inv.role}</p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {inv.match}%
                </Badge>
                <Button size="sm" className="bg-gradient-brand text-brand-foreground">
                  Accept
                </Button>
              </div>
            ))}
          </div>
          <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
            <GraduationCap className="size-3.5" /> Learning path “Startup finance basics” — 62%
            complete
          </div>
        </div>
      </div>
    </div>
  );
}