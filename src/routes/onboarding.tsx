import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ProfileForm, toFormState, type ProfileFormState } from "@/components/profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useMyProfile } from "@/lib/queries";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth/login" });
  },
  head: () => ({
    meta: [
      { title: "Complete your profile — LaunchLoop" },
      { name: "description", content: "Set up your LaunchLoop profile so the right people can find you." },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyProfile(user?.id);
  const [state, setState] = useState<ProfileFormState | null>(null);

  useEffect(() => {
    if (profile && !state) setState(toFormState(profile));
  }, [profile, state]);

  return (
    <div className="page-gradient min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold">Welcome to LaunchLoop</h1>
        <p className="mt-1 mb-6 text-muted-foreground">
          Complete your profile so people can discover you by your skills.
        </p>
        {isLoading || !state || !user ? (
          <Skeleton className="h-96 w-full rounded-xl" />
        ) : (
          <ProfileForm
            userId={user.id}
            state={state}
            setState={setState}
            submitLabel="Save and continue"
            onSaved={() => navigate({ to: "/dashboard" })}
          />
        )}
      </div>
    </div>
  );
}
