import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, Brain, CalendarClock, ShieldCheck } from "lucide-react";

import { PageHeading } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { dealflow } from "@/lib/launchloop-data";

export const Route = createFileRoute("/dashboard/investor")({
  head: () => ({
    meta: [
      { title: "Investor Dashboard — LaunchLoop" },
      {
        name: "description",
        content:
          "Discover verified student startups with trust scores, readiness scores, AI health reports and a managed pipeline.",
      },
      { property: "og:title", content: "Investor Dashboard — LaunchLoop" },
      {
        property: "og:description",
        content: "Verified dealflow with explainable trust and readiness scoring.",
      },
    ],
  }),
  component: InvestorDashboard,
});

const pipeline = [
  { stage: "Screening", items: ["LoopRide", "Kelp Labs"] },
  { stage: "Diligence", items: ["MediTriage AI"] },
  { stage: "Term sheet", items: ["Fintrail"] },
  { stage: "Closed", items: [] as string[] },
];

function InvestorDashboard() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeading
        title="Dealflow"
        description="Northline Capital · Pre-seed & seed · Healthtech, fintech, climate"
        action={<Button variant="outline">Export report</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dealflow.map((d) => (
          <div key={d.name} className="glass shadow-soft rounded-3xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-muted-foreground text-xs">
                  {d.sector} · {d.stage}
                </p>
              </div>
              <Bookmark className="text-muted-foreground size-4" />
            </div>
            <div className="mt-4 space-y-2">
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Trust
                  </span>
                  <span className="font-medium">{d.trust}</span>
                </div>
                <Progress value={d.trust} className="mt-1 h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Readiness</span>
                  <span className="font-medium">{d.readiness}</span>
                </div>
                <Progress value={d.readiness} className="mt-1 h-1.5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary">Raising {d.ask}</Badge>
              <Button size="sm" className="bg-gradient-brand text-brand-foreground">
                Open report
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass shadow-soft rounded-3xl p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Investment pipeline</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {pipeline.map((col) => (
              <div key={col.stage} className="bg-surface-2/60 rounded-2xl p-3">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {col.stage}
                </p>
                <div className="mt-2 space-y-2">
                  {col.items.map((item) => (
                    <div key={item} className="glass rounded-xl px-3 py-2 text-sm">
                      {item}
                    </div>
                  ))}
                  {col.items.length === 0 ? (
                    <p className="text-muted-foreground text-xs">Empty</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <div className="flex items-center gap-2">
            <Brain className="text-primary size-4" />
            <h2 className="font-display text-lg font-semibold">AI investment insights</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="bg-surface-2/60 rounded-2xl p-3">
              MediTriage AI improved trust 8 points in 30 days — fastest in your watchlist.
            </li>
            <li className="bg-surface-2/60 rounded-2xl p-3">
              LoopRide has no mentor association and unverified team; treat trust 58 as soft.
            </li>
            <li className="bg-surface-2/60 rounded-2xl p-3">
              Fintrail meets your seed criteria on 6 of 7 signals — revenue model still unproven.
            </li>
          </ul>
          <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
            <CalendarClock className="size-3.5" /> 3 meeting requests pending
          </div>
        </div>
      </div>
    </div>
  );
}