import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  Compass,
  LayoutDashboard,
  LineChart,
  Search,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard/founder", label: "Founder", icon: LayoutDashboard },
  { to: "/dashboard/journey", label: "Startup Journey", icon: Compass },
  { to: "/dashboard/ai-team", label: "AI Team Engine", icon: Sparkles },
  { to: "/dashboard/registration", label: "Registration", icon: Building2 },
  { to: "/dashboard/student", label: "Student", icon: Users },
  { to: "/dashboard/investor", label: "Investor", icon: Wallet },
  { to: "/dashboard/mentor", label: "Mentor", icon: LineChart },
] as const;

export function DashboardShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="aurora min-h-screen">
      <div className="mx-auto flex w-full max-w-[1500px] gap-6 px-4 py-6 lg:px-8">
        <aside className="glass sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col rounded-3xl p-4 lg:flex">
          <Link to="/" className="mb-6 flex items-center gap-2 px-2">
            <span className="bg-gradient-brand grid size-8 place-items-center rounded-xl text-brand-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="font-display text-lg font-semibold">LaunchLoop</span>
          </Link>
          <nav className="flex flex-1 flex-col gap-1">
            {nav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="glass rounded-2xl p-4">
            <p className="text-sm font-semibold">MediTriage AI</p>
            <p className="text-xs text-muted-foreground">Pre-seed · Healthtech</p>
            <Badge className="mt-3 bg-gradient-brand text-brand-foreground">Trust 72</Badge>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="glass mb-6 flex items-center gap-3 rounded-2xl px-4 py-3">
            <div className="text-muted-foreground flex flex-1 items-center gap-2 text-sm">
              <Search className="size-4" />
              <input
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                placeholder="Search startups, students, mentors, investors, skills…"
              />
            </div>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <ThemeToggle />
            <Avatar className="size-8">
              <AvatarFallback className="bg-gradient-brand text-brand-foreground text-xs">
                NV
              </AvatarFallback>
            </Avatar>
          </header>

          <nav className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "glass shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                  pathname === item.to && "bg-gradient-brand text-brand-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}