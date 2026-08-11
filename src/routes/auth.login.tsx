import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Log in to LaunchLoop" },
      { name: "description", content: "Sign in to your LaunchLoop account to discover people, connect and collaborate." },
      { property: "og:title", content: "Log in to LaunchLoop" },
      { property: "og:description", content: "Sign in to your LaunchLoop account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue building your network.">
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
        </div>
        <Link to="/auth/forgot-password" className="block text-xs text-primary hover:underline">
          Forgot password?
        </Link>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/auth/signup" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
