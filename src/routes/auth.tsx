import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to LaunchLoop — Choose your role" },
      {
        name: "description",
        content:
          "Join LaunchLoop as a founder, student, investor, mentor, developer or volunteer with Google, GitHub, LinkedIn or email OTP.",
      },
      { property: "og:title", content: "Sign in to LaunchLoop" },
      {
        property: "og:description",
        content: "Pick your role and start your startup journey on LaunchLoop.",
      },
    ],
  }),
  component: AuthPage,
});

const roles = [
  { id: "founder", label: "Startup Founder", blurb: "Build, verify and raise", to: "/dashboard/founder" },
  { id: "student", label: "Student", blurb: "Portfolio and startup work", to: "/dashboard/student" },
  { id: "investor", label: "Investor", blurb: "Verified dealflow", to: "/dashboard/investor" },
  { id: "mentor", label: "Mentor", blurb: "Guide and validate", to: "/dashboard/mentor" },
  { id: "developer", label: "Developer", blurb: "Join startup projects", to: "/dashboard/student" },
  { id: "volunteer", label: "Volunteer", blurb: "Events and community", to: "/dashboard/student" },
] as const;

function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"credentials" | "otp" | "role">("credentials");
  const [role, setRole] = useState<(typeof roles)[number]["id"]>("founder");

  const selected = roles.find((r) => r.id === role)!;

  return (
    <div className="aurora flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="glass shadow-elevated w-full max-w-md rounded-3xl p-8">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <span className="bg-gradient-brand text-brand-foreground grid size-8 place-items-center rounded-xl">
            <Sparkles className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold">LaunchLoop</span>
        </Link>

        {step === "credentials" ? (
          <>
            <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Continue your journey from idea to investment-ready.
            </p>
            <div className="mt-6 grid gap-2">
              <Button variant="outline" className="justify-start">
                <Mail className="size-4" /> Continue with Google
              </Button>
              <Button variant="outline" className="justify-start">
                <Github className="size-4" /> Continue with GitHub
              </Button>
              <Button variant="outline" className="justify-start">
                <Linkedin className="size-4" /> Continue with LinkedIn
              </Button>
            </div>
            <div className="text-muted-foreground my-6 flex items-center gap-3 text-xs">
              <span className="bg-border h-px flex-1" /> or email <span className="bg-border h-px flex-1" />
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@college.edu" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" className="mt-1.5" />
              </div>
              <button className="text-muted-foreground hover:text-foreground text-xs">
                Forgot password?
              </button>
              <Button
                className="bg-gradient-brand text-brand-foreground w-full"
                onClick={() => setStep("otp")}
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </>
        ) : step === "otp" ? (
          <>
            <h1 className="font-display text-2xl font-semibold">Verify your email</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              We sent a 6-digit code to your inbox.
            </p>
            <div className="mt-6 flex justify-center">
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              className="bg-gradient-brand text-brand-foreground mt-6 w-full"
              onClick={() => setStep("role")}
            >
              Verify
            </Button>
            <button
              className="text-muted-foreground hover:text-foreground mt-3 w-full text-xs"
              onClick={() => setStep("credentials")}
            >
              Back
            </button>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold">Choose your role</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              LaunchLoop adapts every screen to what you do.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition-colors",
                    role === r.id
                      ? "border-primary bg-accent"
                      : "border-border hover:bg-accent/50",
                  )}
                >
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-muted-foreground text-xs">{r.blurb}</p>
                </button>
              ))}
            </div>
            <Button
              className="bg-gradient-brand text-brand-foreground mt-6 w-full"
              onClick={() => navigate({ to: selected.to })}
            >
              Enter LaunchLoop <ArrowRight className="size-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}