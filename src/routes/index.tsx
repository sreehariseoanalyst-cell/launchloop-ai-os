import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  Compass,
  Globe,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import heroImage from "@/assets/hero-launchloop.jpg";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { journeyStages } from "@/lib/launchloop-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LaunchLoop — From Idea to Investment-Ready" },
      {
        name: "description",
        content:
          "LaunchLoop is the AI startup operating system for student founders: trust scoring, AI team formation, mentorship and a guided roadmap to funding.",
      },
      { property: "og:title", content: "LaunchLoop — From Idea to Investment-Ready" },
      {
        property: "og:description",
        content:
          "Trust scores, AI team matching, mentor validation and a 12-stage roadmap that ends in funding.",
      },
    ],
  }),
  component: Landing,
});

const stats = [
  { value: "24,800", label: "verified student builders" },
  { value: "3,140", label: "startups on the loop" },
  { value: "72%", label: "reach investor readiness" },
  { value: "$41M", label: "raised by alumni startups" },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Startup Trust Engine",
    body: "A 0–100 score built from identity, college, team, prototype, deck, GitHub, registration, mentors and real activity. Credibility you can prove.",
  },
  {
    icon: Users,
    title: "AI Team Formation",
    body: "Describe your idea, get ranked co-builders with explainable compatibility — skills, college, availability and past shipped work.",
  },
  {
    icon: Compass,
    title: "Journey Guide",
    body: "Twelve stages from idea validation to scaling, each with checklists, templates, videos and the next best action.",
  },
  {
    icon: Sparkles,
    title: "Readiness Reports",
    body: "SWOT, risk, competitor and funding-readiness analysis generated from your actual startup data, not a questionnaire.",
  },
  {
    icon: Building2,
    title: "Registration Guide",
    body: "MSME, Startup India, Pvt Ltd, GST, PAN and trademark explained with documents, timelines and eligibility.",
  },
  {
    icon: Globe,
    title: "Website Builder",
    body: "Publish a startup site at yourstartup.launchloop.app and let AI review it for missing sections and weak content.",
  },
];

const personas = [
  { role: "Students", body: "Portfolio, verified contributions, internships and campus leaderboards." },
  { role: "Founders", body: "Team, milestones, trust, website, registration and investor access." },
  { role: "Investors", body: "Verified dealflow with trust, readiness and AI health reports." },
  { role: "Mentors", body: "Assigned startups, milestone validation and structured reviews." },
  { role: "Developers", body: "Join real startup projects, track work, earn ratings." },
  { role: "Volunteers", body: "Run hackathons, events and startup communities." },
];

const pricing = [
  {
    name: "Student",
    price: "Free",
    blurb: "For builders joining startups",
    perks: ["Verified portfolio", "Startup invitations", "Hackathons & community", "Contribution score"],
  },
  {
    name: "Founder",
    price: "$19",
    blurb: "Per month, per startup",
    perks: [
      "Trust & readiness engines",
      "AI team formation",
      "Journey roadmap & templates",
      "Website builder + subdomain",
      "Mentor matching",
    ],
    featured: true,
  },
  {
    name: "Investor",
    price: "Custom",
    blurb: "For funds and angel groups",
    perks: ["Verified dealflow", "AI health reports", "Pipeline management", "Portfolio analytics"],
  },
];

const faqs = [
  {
    q: "How is LaunchLoop different from LinkedIn or Wellfound?",
    a: "Those are directories. LaunchLoop is an operating system: it scores your credibility, tells you the next action, validates milestones with mentors, and only surfaces you to investors when the data says you are ready.",
  },
  {
    q: "What exactly goes into a Trust Score?",
    a: "Founder identity, college verification, verified teammates, prototype, pitch deck, website, GitHub, business registration, mentor association, consistent activity, customer validation, market research and achievements.",
  },
  {
    q: "Do you register my company for me?",
    a: "No. LaunchLoop guides you through MSME, Startup India, company registration, GST, PAN and trademark with document checklists, timelines and official process links.",
  },
  {
    q: "Is LaunchLoop only for Indian student founders?",
    a: "The journey, trust and team engines are global. The registration guide currently covers India in depth, with more regions on the roadmap.",
  },
];

function Landing() {
  return (
    <div className="aurora min-h-screen">
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <div className="glass flex items-center gap-4 rounded-2xl px-4 py-2.5">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-gradient-brand text-brand-foreground grid size-8 place-items-center rounded-xl">
                <Sparkles className="size-4" />
              </span>
              <span className="font-display text-lg font-semibold">LaunchLoop</span>
            </Link>
            <nav className="text-muted-foreground ml-6 hidden gap-6 text-sm md:flex">
              <a href="#features" className="hover:text-foreground">
                Features
              </a>
              <a href="#journey" className="hover:text-foreground">
                Journey
              </a>
              <a href="#pricing" className="hover:text-foreground">
                Pricing
              </a>
              <a href="#faq" className="hover:text-foreground">
                FAQ
              </a>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild className="bg-gradient-brand text-brand-foreground">
                <Link to="/auth">Start free</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-20 lg:grid-cols-2 lg:px-8 lg:pt-20">
          <div className="animate-rise">
            <Badge variant="secondary" className="mb-5">
              <Sparkles className="size-3" /> AI Startup Success Platform
            </Badge>
            <h1 className="font-display text-4xl leading-[1.05] font-semibold sm:text-6xl">
              From a late-night idea to <span className="text-gradient">investment-ready</span>.
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-lg">
              LaunchLoop is the startup operating system for student founders. It builds your team,
              scores your credibility, validates your milestones and walks you stage by stage to
              funding.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="bg-gradient-brand text-brand-foreground">
                <Link to="/auth">
                  Start your loop <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard/founder">See the founder dashboard</Link>
              </Button>
            </div>
            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-gradient text-2xl font-semibold">{s.value}</dt>
                  <dd className="text-muted-foreground mt-1 text-xs">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="animate-float relative">
            <div className="glass shadow-elevated overflow-hidden rounded-[2rem] p-2">
              <img
                src={heroImage}
                alt="LaunchLoop AI dashboard visualisation with trust score orbit"
                width={1408}
                height={1008}
                className="rounded-[1.5rem]"
              />
            </div>
            <div className="glass shadow-soft absolute -bottom-6 -left-4 hidden rounded-2xl px-4 py-3 sm:block">
              <p className="text-muted-foreground text-xs">Trust Score</p>
              <p className="font-display text-gradient text-2xl font-semibold">72 / 100</p>
            </div>
            <div className="glass shadow-soft absolute -top-5 right-2 hidden rounded-2xl px-4 py-3 sm:block">
              <p className="text-muted-foreground text-xs">Match found</p>
              <p className="text-sm font-semibold">Flutter Dev · 94%</p>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <h2 className="font-display max-w-2xl text-3xl font-semibold sm:text-4xl">
            Everything a first-time founder is missing, in one loop.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="glass shadow-soft rounded-3xl p-6">
                <span className="bg-gradient-brand text-brand-foreground grid size-10 place-items-center rounded-2xl">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="journey" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display max-w-xl text-3xl font-semibold sm:text-4xl">
              A roadmap that ends in funding, not in a feed.
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm">
              Twelve AI-personalised stages. Each one has a checklist, resources, templates and a
              mentor sign-off before you move on.
            </p>
          </div>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {journeyStages.map((s, i) => (
              <li key={s.name} className="glass shadow-soft rounded-2xl p-4">
                <span className="text-gradient font-display text-sm font-semibold">
                  Stage {i + 1}
                </span>
                <p className="mt-1 font-medium">{s.name}</p>
                <p className="text-muted-foreground mt-1 text-xs">{s.tasks} checklist items</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Built for six roles</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {personas.map((p) => (
              <div key={p.role} className="glass shadow-soft rounded-3xl p-6">
                <h3 className="text-lg font-semibold">{p.role}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Founders who stopped guessing
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                quote:
                  "We went from a Figma file to an MSME-registered company with a mentor-approved roadmap in nine weeks.",
                name: "Nikhil Verma",
                role: "Founder, MediTriage AI",
              },
              {
                quote:
                  "The trust score is the first credibility signal I actually believe from a student startup.",
                name: "Priya Bhatt",
                role: "Partner, Northline Capital",
              },
              {
                quote:
                  "I joined two startups through team matching and now have verified work on my portfolio.",
                name: "Ananya Iyer",
                role: "Student, IIT Madras",
              },
            ].map((t) => (
              <figure key={t.name} className="glass shadow-soft rounded-3xl p-6">
                <blockquote className="text-sm leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="text-muted-foreground mt-4 text-xs">
                  <span className="text-foreground font-medium">{t.name}</span> · {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Simple pricing</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {pricing.map((p) => (
              <div
                key={p.name}
                className={`glass rounded-3xl p-6 ${p.featured ? "shadow-elevated ring-primary/50 ring-2" : "shadow-soft"}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  {p.featured ? (
                    <Badge className="bg-gradient-brand text-brand-foreground">Most popular</Badge>
                  ) : null}
                </div>
                <p className="font-display mt-4 text-4xl font-semibold">{p.price}</p>
                <p className="text-muted-foreground mt-1 text-sm">{p.blurb}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <Check className="text-primary mt-0.5 size-4 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`mt-6 w-full ${p.featured ? "bg-gradient-brand text-brand-foreground" : ""}`}
                  variant={p.featured ? "default" : "outline"}
                >
                  <Link to="/auth">Get started</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Questions</h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
          <div className="glass shadow-elevated rounded-[2rem] p-10 text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Your idea deserves a system, not a feed.
            </h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm">
              Join thousands of student founders building credibility one verified milestone at a
              time.
            </p>
            <Button size="lg" asChild className="bg-gradient-brand text-brand-foreground mt-8">
              <Link to="/auth">
                Create your startup <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-border/60 border-t">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-8 text-sm lg:px-8">
          <span className="font-display text-foreground font-semibold">LaunchLoop</span>
          <span className="flex items-center gap-1 text-xs">
            <MessagesSquare className="size-3.5" /> Community · Hackathons · Incubators
          </span>
          <span className="ml-auto text-xs">
            © {new Date().getFullYear()} LaunchLoop. Built for student founders.
          </span>
        </div>
      </footer>
    </div>
  );
}
