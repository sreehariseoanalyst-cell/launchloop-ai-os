import { Link } from "@tanstack/react-router";
import { Briefcase, MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { experienceLabel, initials, type Profile } from "@/lib/profile";

export function PersonCard({
  person,
  action,
  reason,
}: {
  person: Profile;
  action?: React.ReactNode;
  reason?: string;
}) {
  return (
    <div className="soft-card flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        <Avatar className="size-12">
          {person.avatar_url ? <AvatarImage src={person.avatar_url} alt="" /> : null}
          <AvatarFallback className="bg-accent text-accent-foreground">
            {initials(person.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{person.full_name || "Unnamed"}</p>
          <p className="truncate text-sm text-muted-foreground">
            {person.primary_role || "Member"}
          </p>
          {person.availability && (
            <Badge variant="secondary" className="mt-1.5 text-[11px]">
              {person.availability}
            </Badge>
          )}
        </div>
      </div>

      {person.bio && <p className="line-clamp-2 text-sm text-muted-foreground">{person.bio}</p>}

      {person.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {person.skills.slice(0, 5).map((s) => (
            <Badge key={s} variant="outline" className="text-[11px] font-normal">
              {s}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {person.location && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3" /> {person.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Briefcase className="size-3" /> {experienceLabel(person.experience_years)}
        </span>
      </div>

      {reason && <p className="text-xs text-primary">{reason}</p>}

      <div className="mt-auto flex gap-2 pt-1">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to="/profile/$id" params={{ id: person.id }}>
            View Profile
          </Link>
        </Button>
        {action}
      </div>
    </div>
  );
}
