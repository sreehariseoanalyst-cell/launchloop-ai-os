import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Globe,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeading } from "@/components/dashboard-shell";
import { ScoreRing } from "@/components/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  activity,
  aiSuggestions,
  investors,
  mentors,
  milestones,
  readinessBreakdown,
  readinessScore,
  teamMembers,
  trustFactors,
  trustHistory,
  trustScore,
} from "@/lib/launchloop-data";

export const Route = createFileRoute("/dashboard/founder")({
  head: () => ({
    meta: [
      { title: "Founder Dashboard — LaunchLoop" },
      {
        name: "description",
        content:
          "Track trust score, readiness score, milestones, team, mentors and investor interest in one founder cockpit.",
      },
      { property: "og:title", content: "Founder Dashboard — LaunchLoop" },
      {
        property: "og:description",
        content: "The founder cockpit for going from idea to investment-ready.",
      },
    ],
  }),
  component: FounderDashboard,
});

function FounderDashboard() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeading
        title="MediTriage AI"
        description="Pre-seed · Healthtech · Founded by Nikhil Verma · 4 team members"
        action={
          <div className="flex gap-2">
            <Button variant="outline">Invite teammate</Button>
            <Button className="bg-gradient-brand text-brand-foreground">
              <Sparkles className="size-4" /> Generate AI report
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass shadow-soft flex flex-col items-center rounded-3xl p-6 text-center">
          <ScoreRing value={trustScore} label="Trust Score" sublabel="+8 this month" />
          <p className="text-muted-foreground mt-4 text-sm">
            Verified identity, college, prototype, deck, website and mentor.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">
              <ShieldCheck className="size-3" /> Identity
            </Badge>
            <Badge variant="secondary">
              <BadgeCheck className="size-3" /> College
            </Badge>
            <Badge variant="secondary">
              <Globe className="size-3" /> Website live
            </Badge>
          </div>
        </div>

        <div className="glass shadow-soft flex flex-col items-center rounded-3xl p-6 text-center">
          <ScoreRing value={readinessScore} label="Readiness" sublabel="Investor-grade at 80" />
          <div className="mt-4 w-full space-y-2 text-left">
            {readinessBreakdown.slice(0, 4).map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-medium">{r.value}%</span>
                </div>
                <Progress value={r.value} className="mt-1 h-1.5" />
              </div>
            ))}
          </div>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <div className="flex items-center gap-2">
            <Bot className="text-primary size-4" />
            <h2 className="font-display text-lg font-semibold">AI suggestions</h2>
          </div>
          <div className="mt-4 space-y-3">
            {aiSuggestions.map((s) => (
              <div key={s.title} className="bg-surface-2/60 rounded-2xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{s.title}</p>
                  <Badge className="bg-gradient-brand text-brand-foreground shrink-0">
                    {s.impact}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass shadow-soft rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Trust & readiness history</h2>
            <Badge variant="secondary">
              <TrendingUp className="size-3" /> +14 in 60 days
            </Badge>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trustHistory} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="trustFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="readyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--signal)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--signal)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="trust"
                  stroke="var(--brand)"
                  strokeWidth={2}
                  fill="url(#trustFill)"
                />
                <Area
                  type="monotone"
                  dataKey="readiness"
                  stroke="var(--signal)"
                  strokeWidth={2}
                  fill="url(#readyFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Verification timeline</h2>
          <ul className="mt-4 space-y-3">
            {trustFactors.map((f) => (
              <li key={f.label} className="flex items-center gap-3 text-sm">
                <span
                  className={
                    f.done
                      ? "bg-gradient-brand size-2.5 shrink-0 rounded-full"
                      : "bg-muted size-2.5 shrink-0 rounded-full"
                  }
                />
                <span className={f.done ? "" : "text-muted-foreground"}>{f.label}</span>
                <span className="text-muted-foreground ml-auto text-xs">+{f.points}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Upcoming milestones</h2>
          <div className="mt-4 space-y-3">
            {milestones.map((m) => (
              <div key={m.title} className="bg-surface-2/60 rounded-2xl p-3">
                <p className="text-sm font-medium">{m.title}</p>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                  <span>{m.due}</span>·<span>{m.owner}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {m.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Team</h2>
          <div className="mt-4 space-y-3">
            {teamMembers.map((t) => (
              <div key={t.name} className="flex items-center gap-3">
                <span className="bg-gradient-brand text-brand-foreground grid size-9 place-items-center rounded-full text-xs font-semibold">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
                <div className="ml-auto text-right text-xs">
                  <p className="font-medium">{t.tasks} tasks</p>
                  <p className="text-muted-foreground">★ {t.rating}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4 w-full" asChild>
            <Link to="/dashboard/ai-team">Find missing roles with AI</Link>
          </Button>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Activity feed</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {activity.map((a) => (
              <li key={a.what} className="border-border/60 border-b pb-3 last:border-0">
                <span className="font-medium">{a.who}</span>{" "}
                <span className="text-muted-foreground">{a.what}</span>
                <p className="text-muted-foreground mt-0.5 text-xs">{a.when}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Mentor matches</h2>
          <div className="mt-4 space-y-3">
            {mentors.map((m) => (
              <div
                key={m.name}
                className="bg-surface-2/60 flex items-center gap-3 rounded-2xl p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-muted-foreground text-xs">{m.focus}</p>
                </div>
                <Badge className="bg-gradient-brand text-brand-foreground ml-auto">
                  {m.match}%
                </Badge>
                <Button size="sm" variant="ghost">
                  Request
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold">Investor interest</h2>
          <div className="mt-4 space-y-3">
            {investors.map((i) => (
              <div
                key={i.name}
                className="bg-surface-2/60 flex items-center gap-3 rounded-2xl p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {i.focus} · {i.ticket} · {i.stage}
                  </p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {i.match}% match
                </Badge>
                <ArrowUpRight className="text-muted-foreground size-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}