import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Certification = Database["public"]["Tables"]["certifications"]["Row"];

export const AVAILABILITY_OPTIONS = [
  "Full-time",
  "Part-time",
  "Weekends",
  "Evenings",
  "Internship",
  "Not available",
] as const;

export const QUALIFICATION_OPTIONS = [
  "High School",
  "Diploma",
  "Bachelors",
  "Masters",
  "PhD",
  "Self-taught",
] as const;

export const ROLE_OPTIONS = [
  "Student",
  "Startup Founder",
  "Developer",
  "Designer",
  "Marketer",
  "Volunteer",
  "Mentor",
  "Investor",
] as const;

export type CompletionItem = { label: string; weight: number; done: boolean };

export function profileCompletion(
  profile: Partial<Profile> | null | undefined,
  certificationCount = 0,
): { percent: number; items: CompletionItem[] } {
  const p = profile ?? {};
  const items: CompletionItem[] = [
    { label: "Add profile photo", weight: 10, done: !!p.avatar_url },
    { label: "Write a short bio", weight: 10, done: !!p.bio && p.bio.trim().length > 20 },
    { label: "Add your location", weight: 10, done: !!p.location },
    { label: "Add your qualification", weight: 10, done: !!p.qualification },
    { label: "Add your experience", weight: 10, done: Number(p.experience_years ?? 0) > 0 },
    { label: "Add at least 3 skills", weight: 20, done: (p.skills?.length ?? 0) >= 3 },
    { label: "Add languages you speak", weight: 10, done: (p.languages?.length ?? 0) > 0 },
    { label: "Set your availability", weight: 10, done: !!p.availability },
    { label: "Add a portfolio link", weight: 5, done: !!p.portfolio_url },
    { label: "Add a certification", weight: 5, done: certificationCount > 0 },
  ];
  const percent = items.reduce((sum, i) => sum + (i.done ? i.weight : 0), 0);
  return { percent, items };
}

export function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function experienceLabel(years: number | null | undefined) {
  const y = Number(years ?? 0);
  if (!y) return "No experience yet";
  if (y === 1) return "1 year experience";
  if (y < 1) return `${Math.round(y * 12)} months experience`;
  return `${y} years experience`;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
