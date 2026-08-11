import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { TagInput } from "@/components/tag-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  AVAILABILITY_OPTIONS,
  QUALIFICATION_OPTIONS,
  ROLE_OPTIONS,
  initials,
  type Profile,
} from "@/lib/profile";

export type ProfileFormState = {
  full_name: string;
  avatar_url: string | null;
  bio: string;
  location: string;
  organization: string;
  qualification: string;
  experience_years: string;
  primary_role: string;
  skills: string[];
  languages: string[];
  interests: string[];
  availability: string;
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
};

export function toFormState(p: Profile | null | undefined): ProfileFormState {
  return {
    full_name: p?.full_name ?? "",
    avatar_url: p?.avatar_url ?? null,
    bio: p?.bio ?? "",
    location: p?.location ?? "",
    organization: p?.organization ?? "",
    qualification: p?.qualification ?? "",
    experience_years: String(p?.experience_years ?? 0),
    primary_role: p?.primary_role ?? "",
    skills: p?.skills ?? [],
    languages: p?.languages ?? [],
    interests: p?.interests ?? [],
    availability: p?.availability ?? "",
    portfolio_url: p?.portfolio_url ?? "",
    linkedin_url: p?.linkedin_url ?? "",
    github_url: p?.github_url ?? "",
  };
}

export function ProfileForm({
  userId,
  state,
  setState,
  onSaved,
  submitLabel = "Save changes",
}: {
  userId: string;
  state: ProfileFormState;
  setState: (next: ProfileFormState) => void;
  onSaved?: () => void;
  submitLabel?: string;
}) {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) =>
    setState({ ...state, [key]: value });

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data, error: signErr } = await supabase.storage
        .from("avatars")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
      if (signErr) throw signErr;
      set("avatar_url", data.signedUrl);
      toast.success("Photo uploaded — remember to save");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.full_name.trim()) {
      toast.error("Your full name is required.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: state.full_name.trim(),
        avatar_url: state.avatar_url,
        bio: state.bio || null,
        location: state.location || null,
        organization: state.organization || null,
        qualification: state.qualification || null,
        experience_years: Number(state.experience_years) || 0,
        primary_role: state.primary_role || null,
        skills: state.skills,
        languages: state.languages,
        interests: state.interests,
        availability: state.availability || null,
        portfolio_url: state.portfolio_url || null,
        linkedin_url: state.linkedin_url || null,
        github_url: state.github_url || null,
        onboarded: true,
      })
      .eq("id", userId);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved");
    void qc.invalidateQueries({ queryKey: ["profile", userId] });
    onSaved?.();
  };

  return (
    <form className="space-y-5" onSubmit={save}>
      <div className="soft-card space-y-5 p-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            {state.avatar_url ? <AvatarImage src={state.avatar_url} alt="" /> : null}
            <AvatarFallback className="bg-accent text-accent-foreground">
              {initials(state.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar" className="cursor-pointer">
              <span className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-muted">
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                {uploading ? "Uploading…" : "Upload photo"}
              </span>
            </Label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadAvatar(file);
              }}
            />
            <p className="mt-1 text-xs text-muted-foreground">JPG or PNG, up to a few MB.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" value={state.full_name} onChange={(e) => set("full_name", e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Primary role</Label>
            <Select value={state.primary_role} onValueChange={(v) => set("primary_role", v)}>
              <SelectTrigger className="mt-1.5 w-full"><SelectValue placeholder="Select a role" /></SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={3} value={state.bio} onChange={(e) => set("bio", e.target.value)} className="mt-1.5" placeholder="What are you working on and what are you looking for?" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={state.location} onChange={(e) => set("location", e.target.value)} className="mt-1.5" placeholder="Coimbatore" />
          </div>
          <div>
            <Label htmlFor="organization">College / Organization</Label>
            <Input id="organization" value={state.organization} onChange={(e) => set("organization", e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Qualification</Label>
            <Select value={state.qualification} onValueChange={(v) => set("qualification", v)}>
              <SelectTrigger className="mt-1.5 w-full"><SelectValue placeholder="Select qualification" /></SelectTrigger>
              <SelectContent>
                {QUALIFICATION_OPTIONS.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="experience">Experience (years)</Label>
            <Input id="experience" type="number" min="0" step="0.5" value={state.experience_years} onChange={(e) => set("experience_years", e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Availability</Label>
            <Select value={state.availability} onValueChange={(v) => set("availability", v)}>
              <SelectTrigger className="mt-1.5 w-full"><SelectValue placeholder="Select availability" /></SelectTrigger>
              <SelectContent>
                {AVAILABILITY_OPTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TagInput label="Skills" placeholder="React, Python, UI/UX…" values={state.skills} onChange={(v) => set("skills", v)} />
        <TagInput label="Languages" placeholder="English, Tamil…" values={state.languages} onChange={(v) => set("languages", v)} />
        <TagInput label="Interests" placeholder="Healthtech, Design…" values={state.interests} onChange={(v) => set("interests", v)} />

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input id="portfolio" value={state.portfolio_url} onChange={(e) => set("portfolio_url", e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" value={state.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="github">GitHub URL</Label>
            <Input id="github" value={state.github_url} onChange={(e) => set("github_url", e.target.value)} className="mt-1.5" />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={saving || uploading}>
        {saving ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
