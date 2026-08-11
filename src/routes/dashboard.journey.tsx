import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, FileText, PlayCircle, Sparkles } from "lucide-react";

import { PageHeading } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { journeyStages } from "@/lib/launchloop-data";

export const Route = createFileRoute("/dashboard/journey")({
  head: () => ({
    meta: [
      { title: "Startup Journey Roadmap — LaunchLoop" },
      {
        name: "description",
        content:
          "A personalised 12-stage roadmap from idea validation to scaling, with checklists, resources and AI guidance.",
      },
      { property: "og:title", content: "Startup Journey Roadmap — LaunchLoop" },
      {
        property: "og:description",
        content: "From idea validation to funding — one guided stage at a time.",
      },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const current = journeyStages.findIndex((s) => s.progress > 0 && s.progress < 100);
  const overall = Math.round(
    journeyStages.reduce((s, stage) => s + stage.progress, 0) / journeyStages.length,
  );

  return (
    <div className="space-y-6 pb-10">
      <PageHeading
        title="Startup journey"
        description={`12 stages · ${overall}% complete · AI keeps the next best action in front of you`}
        action={
          <Button className="bg-gradient-brand text-brand-foreground">
            <Sparkles className="size-4" /> Regenerate roadmap
          </Button>
        }
      />

      <div className="glass shadow-soft rounded-3xl p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Overall journey progress</span>
          <span className="text-muted-foreground">{overall}%</span>
        </div>
        <Progress value={overall} className="mt-3 h-2" />
      </div>

      <div className="space-y-4">
        {journeyStages.map((stage, index) => {
          const complete = stage.progress === 100;
          const active = index === current;
          return (
            <div
              key={stage.name}
              className={`glass shadow-soft rounded-3xl p-5 ${active ? "ring-primary/50 ring-2" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                {complete ? (
                  <CheckCircle2 className="text-primary size-5 shrink-0" />
                ) : (
                  <Circle className="text-muted-foreground size-5 shrink-0" />
                )}
                <div className="min-w-0">
                  <h2 className="font-display text-base font-semibold">
                    {index + 1}. {stage.name}
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    {stage.done}/{stage.tasks} checklist items complete
                  </p>
                </div>
                {active ? (
                  <Badge className="bg-gradient-brand text-brand-foreground">You are here</Badge>
                ) : null}
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-sm font-medium">{stage.progress}%</span>
                  <Button size="sm" variant="outline">
                    Open stage
                  </Button>
                </div>
              </div>
              <Progress value={stage.progress} className="mt-3 h-1.5" />
              <div className="text-muted-foreground mt-3 flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <PlayCircle className="size-3.5" /> 3 videos
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="size-3.5" /> Templates & resources
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="size-3.5" /> AI suggestions
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}