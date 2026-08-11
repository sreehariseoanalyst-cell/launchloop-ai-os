import { Link } from "@tanstack/react-router";
import { Check, Circle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { profileCompletion, type Profile } from "@/lib/profile";

export function ProfileCompletionCard({
  profile,
  certificationCount,
}: {
  profile: Profile | null;
  certificationCount: number;
}) {
  const { percent, items } = profileCompletion(profile, certificationCount);
  return (
    <aside className="soft-card h-fit p-5">
      <h2 className="font-display text-lg font-semibold">Profile completion</h2>
      <div className="mt-3 flex items-center gap-3">
        <Progress value={percent} className="h-2" />
        <span className="text-sm font-semibold">{percent}%</span>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.label} className={i.done ? "flex items-center gap-2 text-muted-foreground" : "flex items-center gap-2"}>
            {i.done ? <Check className="size-4 text-success" /> : <Circle className="size-4 text-muted-foreground" />}
            <span className={i.done ? "line-through" : ""}>{i.label}</span>
          </li>
        ))}
      </ul>
      {percent < 100 && (
        <Button asChild className="mt-4 w-full">
          <Link to="/profile">Complete profile</Link>
        </Button>
      )}
    </aside>
  );
}
