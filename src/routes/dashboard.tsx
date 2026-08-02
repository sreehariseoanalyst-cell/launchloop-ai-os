import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "@/components/dashboard-shell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "LaunchLoop Workspace — Startup Operating System" },
      {
        name: "description",
        content:
          "Trust score, readiness score, AI team formation and milestone roadmap for your startup.",
      },
      { property: "og:title", content: "LaunchLoop Workspace" },
      { property: "og:description", content: "Your startup's AI-powered operating system." },
    ],
  }),
  component: DashboardShell,
});