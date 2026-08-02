export type Role = "founder" | "student" | "investor" | "mentor";

export const trustFactors = [
  { label: "Founder identity verified", points: 10, done: true },
  { label: "College verification", points: 8, done: true },
  { label: "Team verified (3/5)", points: 8, done: true },
  { label: "Prototype uploaded", points: 10, done: true },
  { label: "Pitch deck uploaded", points: 8, done: true },
  { label: "Website created", points: 8, done: true },
  { label: "GitHub repository linked", points: 6, done: true },
  { label: "Market research report", points: 6, done: true },
  { label: "Mentor association", points: 8, done: true },
  { label: "Customer validation (10 interviews)", points: 10, done: false },
  { label: "Business registration (MSME)", points: 10, done: false },
  { label: "Hackathon wins & achievements", points: 8, done: false },
];

export const trustScore = trustFactors
  .filter((f) => f.done)
  .reduce((sum, f) => sum + f.points, 0);

export const readinessBreakdown = [
  { label: "Business model", value: 78 },
  { label: "Prototype", value: 84 },
  { label: "Team", value: 66 },
  { label: "Pitch deck", value: 71 },
  { label: "Market validation", value: 42 },
  { label: "Competition analysis", value: 58 },
  { label: "Revenue model", value: 61 },
  { label: "Technology", value: 88 },
];

export const readinessScore = Math.round(
  readinessBreakdown.reduce((s, r) => s + r.value, 0) / readinessBreakdown.length,
);

export const journeyStages = [
  { name: "Idea Validation", progress: 100, tasks: 6, done: 6 },
  { name: "Market Research", progress: 100, tasks: 5, done: 5 },
  { name: "Business Model", progress: 80, tasks: 5, done: 4 },
  { name: "Team Formation", progress: 70, tasks: 6, done: 4 },
  { name: "Prototype Development", progress: 85, tasks: 7, done: 6 },
  { name: "Website Creation", progress: 60, tasks: 5, done: 3 },
  { name: "Trust Building", progress: 65, tasks: 8, done: 5 },
  { name: "Startup Readiness", progress: 40, tasks: 6, done: 2 },
  { name: "Business Registration", progress: 15, tasks: 7, done: 1 },
  { name: "Investor Readiness", progress: 0, tasks: 6, done: 0 },
  { name: "Funding", progress: 0, tasks: 5, done: 0 },
  { name: "Scaling", progress: 0, tasks: 6, done: 0 },
];

export const aiSuggestions = [
  {
    title: "Run 10 customer interviews this week",
    impact: "+10 trust",
    body: "Market validation is your weakest readiness pillar at 42%. Interviews with clinic admins unlock the validation badge.",
  },
  {
    title: "Add a Flutter developer to the team",
    impact: "+8 readiness",
    body: "Your prototype roadmap needs mobile delivery by Q3. Three high-compatibility candidates are available now.",
  },
  {
    title: "Start MSME registration",
    impact: "+10 trust",
    body: "You qualify today. Registration takes ~3 days and most seed investors expect it before diligence.",
  },
];

export const teamMatches = [
  {
    name: "Aarav Menon",
    role: "Flutter Developer",
    compat: 94,
    college: "IIT Madras",
    availability: "20 hrs/week",
    reasons: ["Healthcare experience", "Flutter", "Same college", "2 hackathon wins"],
  },
  {
    name: "Diya Sharma",
    role: "Backend Developer",
    compat: 91,
    college: "BITS Pilani",
    availability: "15 hrs/week",
    reasons: ["FastAPI + Postgres", "HIPAA basics", "Ships fast"],
  },
  {
    name: "Kabir Nair",
    role: "UI/UX Designer",
    compat: 88,
    college: "NID Ahmedabad",
    availability: "12 hrs/week",
    reasons: ["Medical dashboards", "Design systems", "Nearby"],
  },
  {
    name: "Ishita Rao",
    role: "Marketing Lead",
    compat: 84,
    college: "SRCC Delhi",
    availability: "10 hrs/week",
    reasons: ["B2B clinic outreach", "Content engine", "Sales background"],
  },
  {
    name: "Rohan Gupta",
    role: "Business Strategist",
    compat: 81,
    college: "IIM Bangalore",
    availability: "8 hrs/week",
    reasons: ["Unit economics", "Healthcare payer models"],
  },
  {
    name: "Adv. Meera Iyer",
    role: "Legal Advisor",
    compat: 79,
    college: "NLSIU",
    availability: "5 hrs/week",
    reasons: ["Health data compliance", "Startup India filings"],
  },
];

export const milestones = [
  { title: "Ship v0.4 triage prototype", due: "In 3 days", owner: "Product", status: "On track" },
  { title: "10 clinic discovery calls", due: "In 6 days", owner: "Founder", status: "At risk" },
  { title: "Mentor review — business model", due: "In 8 days", owner: "Mentor", status: "Scheduled" },
  { title: "MSME application submitted", due: "In 14 days", owner: "Ops", status: "Not started" },
];

export const activity = [
  { who: "Diya Sharma", what: "completed task “Auth service hardening”", when: "12m ago" },
  { who: "Dr. Anand Krishnan", what: "approved milestone “Market research”", when: "2h ago" },
  { who: "Northline Capital", what: "bookmarked your startup", when: "5h ago" },
  { who: "Trust Engine", what: "raised trust score from 68 to 72", when: "Yesterday" },
  { who: "Aarav Menon", what: "accepted your team invitation", when: "2d ago" },
];

export const trustHistory = [
  { month: "Feb", trust: 22, readiness: 18 },
  { month: "Mar", trust: 34, readiness: 27 },
  { month: "Apr", trust: 43, readiness: 39 },
  { month: "May", trust: 55, readiness: 48 },
  { month: "Jun", trust: 64, readiness: 57 },
  { month: "Jul", trust: 72, readiness: 69 },
];

export const teamMembers = [
  { name: "Nikhil Verma", role: "Founder / CEO", tasks: 24, rating: 4.9 },
  { name: "Diya Sharma", role: "Backend Developer", tasks: 31, rating: 4.8 },
  { name: "Kabir Nair", role: "UI/UX Designer", tasks: 18, rating: 4.7 },
  { name: "Ishita Rao", role: "Marketing Lead", tasks: 12, rating: 4.5 },
];

export const mentors = [
  { name: "Dr. Anand Krishnan", focus: "Healthtech · Regulatory", match: 96, sessions: 4 },
  { name: "Sara Fernandes", focus: "B2B GTM · SaaS pricing", match: 89, sessions: 2 },
  { name: "Vikram Shetty", focus: "Seed fundraising", match: 85, sessions: 1 },
];

export const investors = [
  { name: "Northline Capital", ticket: "$150k–$500k", stage: "Pre-seed", match: 92, focus: "Healthtech" },
  { name: "Campus Fund", ticket: "$50k–$200k", stage: "Pre-seed", match: 88, focus: "Student founders" },
  { name: "Meridian Ventures", ticket: "$300k–$1M", stage: "Seed", match: 81, focus: "AI infrastructure" },
];

export const registrationSteps = [
  {
    name: "PAN (Business)",
    status: "Complete",
    time: "3–5 days",
    docs: ["Founder ID proof", "Address proof", "Photograph"],
    why: "Mandatory tax identity for every registered entity.",
  },
  {
    name: "MSME / Udyam",
    status: "In progress",
    time: "1–3 days",
    docs: ["Aadhaar", "PAN", "Bank details", "NIC code"],
    why: "Unlocks subsidised loans, tender preference and fee waivers.",
  },
  {
    name: "Company Registration (Pvt Ltd)",
    status: "Not started",
    time: "10–15 days",
    docs: ["DSC", "DIN", "MoA & AoA", "Registered office proof"],
    why: "Required for equity fundraising and ESOP issuance.",
  },
  {
    name: "Startup India Recognition",
    status: "Not started",
    time: "5–10 days",
    docs: ["Incorporation certificate", "Pitch deck", "Innovation write-up"],
    why: "Tax exemption for 3 years plus government grant eligibility.",
  },
  {
    name: "GST Registration",
    status: "Not started",
    time: "3–7 days",
    docs: ["PAN", "Incorporation proof", "Bank statement"],
    why: "Required once turnover crosses the threshold or for B2B invoicing.",
  },
  {
    name: "Trademark",
    status: "Not started",
    time: "6–18 months",
    docs: ["Logo file", "Class selection", "Applicant details"],
    why: "Protects your brand name and logo from copycats.",
  },
];

export const studentProjects = [
  { name: "MediTriage mobile app", role: "Flutter Developer", startup: "MediTriage AI", impact: "+18 contribution" },
  { name: "Campus rideshare", role: "Full-stack", startup: "LoopRide", impact: "+12 contribution" },
  { name: "Design system audit", role: "UI Designer", startup: "Fintrail", impact: "+7 contribution" },
];

export const studentSkills = [
  { name: "Flutter", level: 88 },
  { name: "AI / ML", level: 74 },
  { name: "UI/UX", level: 66 },
  { name: "Marketing", level: 41 },
  { name: "Public speaking", level: 58 },
];

export const leaderboard = [
  { name: "Aarav Menon", score: 1840 },
  { name: "You", score: 1712 },
  { name: "Diya Sharma", score: 1655 },
  { name: "Kabir Nair", score: 1490 },
  { name: "Ishita Rao", score: 1322 },
];

export const dealflow = [
  { name: "MediTriage AI", sector: "Healthtech", trust: 72, readiness: 68, ask: "$250k", stage: "Pre-seed" },
  { name: "Fintrail", sector: "Fintech", trust: 81, readiness: 74, ask: "$400k", stage: "Seed" },
  { name: "LoopRide", sector: "Mobility", trust: 58, readiness: 49, ask: "$120k", stage: "Pre-seed" },
  { name: "Kelp Labs", sector: "Climate", trust: 66, readiness: 61, ask: "$300k", stage: "Pre-seed" },
];

export const mentorStartups = [
  { name: "MediTriage AI", stage: "Prototype", pending: 2, lastReview: "6 days ago", progress: 68 },
  { name: "Kelp Labs", stage: "Market research", pending: 1, lastReview: "2 days ago", progress: 41 },
  { name: "Fintrail", stage: "Investor readiness", pending: 0, lastReview: "Today", progress: 79 },
];