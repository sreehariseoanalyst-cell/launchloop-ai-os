import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your LaunchLoop password" },
      { name: "description", content: "Request a password reset link for your LaunchLoop account." },
      { property: "og:title", content: "Reset your LaunchLoop password" },
      { property: "og:description", content: "Request a password reset link." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Enter your email address.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Reset link sent");
  };

  return (
    <AuthLayout title="Forgot password" subtitle="We'll email you a reset link.">
      {sent ? (
        <p className="text-sm text-muted-foreground">
          If an account exists for {email}, a password reset link is on its way.
        </p>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/auth/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
