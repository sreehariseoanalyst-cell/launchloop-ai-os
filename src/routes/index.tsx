import { createFileRoute, Link } from "@tanstack/react-router";
import { MessagesSquare, Search, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LaunchLoop — Find collaborators by skills, not follower counts" },
      {
        name: "description",
        content:
          "LaunchLoop helps students, founders, mentors and investors discover each other by skills, experience and availability — then connect and chat in real time.",
      },
      { property: "og:title", content: "LaunchLoop — Collaborate with the right people" },
      {
        property: "og:description",
        content: "Build a profile, discover people by skills, send connection requests and message in real time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const steps = [
  { icon: UserPlus, title: "Build your profile", body: "Add your skills, experience, availability, languages and certifications." },
  { icon: Search, title: "Discover people", body: "Search and filter by skill, role, location, availability and experience." },
  { icon: Users, title: "Connect", body: "Send a request, get accepted, and grow a real collaboration network." },
  { icon: MessagesSquare, title: "Communicate", body: "Chat 1-to-1 in real time with unread counts and notifications." },
];

function LandingPage() {
  return (
    <div className="page-gradient min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-display text-lg font-semibold">LaunchLoop</span>
        <div className="flex gap-2">
          <Button asChild variant="ghost"><Link to="/auth/login">Log in</Link></Button>
          <Button asChild><Link to="/auth/signup">Get started</Link></Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24">
        <section className="py-16 text-center sm:py-24">
          <h1 className="font-display mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Find the right people to build with.
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            LaunchLoop matches students, founders, developers, mentors and investors on skills,
            experience and availability — then gets you talking.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg"><Link to="/auth/signup">Create your profile</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/auth/login">I already have an account</Link></Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.title} className="soft-card p-5">
              <span className="bg-accent text-accent-foreground grid size-9 place-items-center rounded-lg">
                <s.icon className="size-4" />
              </span>
              <h2 className="mt-3 text-base font-semibold">{s.title}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{s.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-border border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} LaunchLoop
      </footer>
    </div>
  );
}
