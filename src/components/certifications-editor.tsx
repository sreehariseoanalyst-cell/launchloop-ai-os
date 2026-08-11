import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useCertifications } from "@/lib/queries";

export function CertificationsEditor({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: certs, isLoading } = useCertifications(userId);
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [year, setYear] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Certification name is required.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("certifications").insert({
      profile_id: userId,
      name: name.trim(),
      issuer: issuer.trim() || null,
      year: year ? Number(year) : null,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setName("");
    setIssuer("");
    setYear("");
    toast.success("Certification added");
    void qc.invalidateQueries({ queryKey: ["certifications", userId] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    void qc.invalidateQueries({ queryKey: ["certifications", userId] });
  };

  return (
    <div className="soft-card p-5">
      <h2 className="font-display text-lg font-semibold">Certifications</h2>
      {isLoading ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
      ) : certs && certs.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {certs.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {[c.issuer, c.year].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => void remove(c.id)}>
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No certifications added yet.</p>
      )}

      <form className="mt-4 grid gap-3 sm:grid-cols-[2fr_2fr_1fr_auto]" onSubmit={add}>
        <div>
          <Label htmlFor="cert-name" className="text-xs">Name</Label>
          <Input id="cert-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="cert-issuer" className="text-xs">Issuer</Label>
          <Input id="cert-issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="cert-year" className="text-xs">Year</Label>
          <Input id="cert-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} className="mt-1" />
        </div>
        <Button type="submit" variant="outline" className="self-end" disabled={busy}>
          {busy ? "Adding…" : "Add"}
        </Button>
      </form>
    </div>
  );
}
