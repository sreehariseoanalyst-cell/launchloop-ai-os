import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeading } from "@/components/app-shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { AVAILABILITY_OPTIONS } from "@/lib/profile";
import { useMyProfile } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LaunchLoop" },
      { name: "description", content: "Update your name, location, availability, visibility and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyProfile(user?.id);
  const [form, setForm] = useState({ full_name: "", location: "", availability: "", is_visible: true, show_email: false, email_notifications: true });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        location: profile.location ?? "",
        availability: profile.availability ?? "",
        is_visible: profile.is_visible,
        show_email: profile.show_email,
        email_notifications: profile.email_notifications,
      });
    }
  }, [profile]);

  if (isLoading || !user) return <Skeleton className="h-80 w-full rounded-xl" />;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        location: form.location || null,
        availability: form.availability || null,
        is_visible: form.is_visible,
        show_email: form.show_email,
        email_notifications: form.email_notifications,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Settings saved");
    void qc.invalidateQueries({ queryKey: ["profile", user.id] });
  };

  const deleteAccount = async () => {
    setDeleting(true);
    const { error } = await supabase.from("profiles").delete().eq("id", user.id);
    setDeleting(false);
    if (error) {
      toast.error("Could not delete your data: " + error.message);
      return;
    }
    await supabase.auth.signOut();
    qc.clear();
    toast.success("Your profile and data were deleted");
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeading title="Settings" description="Control your account, visibility and notifications." />

      <div className="soft-card space-y-4 p-5">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" className="mt-1.5" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" className="mt-1.5" value={user.email ?? ""} disabled />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" className="mt-1.5" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div>
          <Label>Availability</Label>
          <Select value={form.availability} onValueChange={(v) => setForm({ ...form, availability: v })}>
            <SelectTrigger className="mt-1.5 w-full"><SelectValue placeholder="Select availability" /></SelectTrigger>
            <SelectContent>{AVAILABILITY_OPTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Toggle label="Profile visible in Discover" checked={form.is_visible} onChange={(v) => setForm({ ...form, is_visible: v })} />
        <Toggle label="Show my email on my profile" checked={form.show_email} onChange={(v) => setForm({ ...form, show_email: v })} />
        <Toggle label="Email notifications" checked={form.email_notifications} onChange={(v) => setForm({ ...form, email_notifications: v })} />
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save settings"}</Button>
      </div>

      <div className="soft-card space-y-3 p-5">
        <h2 className="font-display text-lg font-semibold">Danger zone</h2>
        <p className="text-sm text-muted-foreground">
          Deleting your account removes your profile, connections, messages and notifications permanently.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleting}>{deleting ? "Deleting…" : "Delete account"}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>This cannot be undone. All of your data will be removed.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => void deleteAccount()}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
