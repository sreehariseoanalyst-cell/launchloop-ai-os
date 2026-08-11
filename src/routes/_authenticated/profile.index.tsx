import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeading } from "@/components/app-shell";
import { CertificationsEditor } from "@/components/certifications-editor";
import { ProfileCompletionCard } from "@/components/profile-completion-card";
import { ProfileForm, toFormState, type ProfileFormState } from "@/components/profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useCertifications, useMyProfile } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/profile/")({
  head: () => ({
    meta: [
      { title: "My profile — LaunchLoop" },
      { name: "description", content: "Edit your LaunchLoop profile: skills, languages, experience, availability and links." },
    ],
  }),
  component: MyProfilePage,
});

function MyProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useMyProfile(user?.id);
  const { data: certs } = useCertifications(user?.id);
  const [state, setState] = useState<ProfileFormState | null>(null);

  useEffect(() => {
    if (profile && !state) setState(toFormState(profile));
  }, [profile, state]);

  if (isLoading || !state || !user) return <Skeleton className="h-96 w-full rounded-xl" />;

  return (
    <div className="space-y-5">
      <PageHeading title="My profile" description="Keep your profile current so the right people can find you." />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <ProfileForm userId={user.id} state={state} setState={setState} />
          <CertificationsEditor userId={user.id} />
        </div>
        <ProfileCompletionCard profile={profile ?? null} certificationCount={certs?.length ?? 0} />
      </div>
    </div>
  );
}
