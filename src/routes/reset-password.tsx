import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — LaunchLoop" },
      { name: "description", content: "Choose a new password for your LaunchLoop account." },
      { property: "og:title", content: "Set a new password — LaunchLoop" },
      { property: "og:description", content: "Choose a new password for your account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Choose something secure you'll remember.">
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
