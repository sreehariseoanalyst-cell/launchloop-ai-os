import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, FileCheck2, Loader2 } from "lucide-react";

import { PageHeading } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { registrationSteps } from "@/lib/launchloop-data";

export const Route = createFileRoute("/dashboard/registration")({
  head: () => ({
    meta: [
      { title: "Government Registration Guide — LaunchLoop" },
      {
        name: "description",
        content:
          "Step-by-step guidance for MSME, Startup India, company registration, GST, PAN and trademark with documents and timelines.",
      },
      { property: "og:title", content: "Government Registration Guide — LaunchLoop" },
      {
        property: "og:description",
        content: "Know exactly which filings you need, what they cost you in time, and why.",
      },
    ],
  }),
  component: RegistrationPage,
});

function RegistrationPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeading
        title="Business registration guide"
        description="LaunchLoop never files on your behalf — it tells you exactly what to file, in what order, with which documents."
      />

      <div className="space-y-4">
        {registrationSteps.map((step, i) => (
          <div key={step.name} className="glass shadow-soft rounded-3xl p-5">
            <div className="flex flex-wrap items-center gap-3">
              {step.status === "Complete" ? (
                <CheckCircle2 className="text-primary size-5" />
              ) : step.status === "In progress" ? (
                <Loader2 className="text-primary size-5" />
              ) : (
                <FileCheck2 className="text-muted-foreground size-5" />
              )}
              <div>
                <h2 className="font-display text-base font-semibold">
                  {i + 1}. {step.name}
                </h2>
                <p className="text-muted-foreground text-xs">{step.why}</p>
              </div>
              <Badge
                variant={step.status === "Not started" ? "secondary" : "default"}
                className={
                  step.status === "Not started" ? "" : "bg-gradient-brand text-brand-foreground"
                }
              >
                {step.status}
              </Badge>
              <span className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
                <Clock className="size-3.5" /> {step.time}
              </span>
              <Button size="sm" variant="outline">
                Official process
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {step.docs.map((d) => (
                <Badge key={d} variant="secondary" className="text-[11px]">
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}