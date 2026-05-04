import arvada from "@/assets/journey-arvada.jpg";
import eugene from "@/assets/journey-eugene.jpg";
import copper from "@/assets/journey-copper.jpg";
import sydney from "@/assets/journey-sydney.jpg";
import golden from "@/assets/journey-golden.jpg";
import boulder from "@/assets/journey-boulder.jpg";

export type Stop = {
  id: string;
  index: string;
  place: string;
  coords: string;
  role: string;
  org: string;
  date: string;
  body: string;
  image: string;
};

export const STOPS: Stop[] = [
  {
    id: "arvada",
    index: "00",
    place: "Arvada, Colorado",
    coords: "39.8028° N · 105.0875° W",
    role: "Origin Station",
    org: "Front Range, USA",
    date: "—",
    body: "The journey begins at the foot of the Rockies. Dual citizen, raised between continents, drawn to mountains and systems that hold them together.",
    image: arvada,
  },
  {
    id: "central-park",
    index: "01",
    place: "Central Park, Denver",
    coords: "39.7711° N · 104.8987° W",
    role: "Maintenance Lead · Pool Technician",
    org: "MCA Central Park",
    date: "Jun 2021 — Sep 2024",
    body: "First taste of operational responsibility. Daily ops at a high-traffic aquatic facility — safety, scheduling, regulatory compliance, real teams under real heat.",
    image: arvada,
  },
  {
    id: "copper",
    index: "02",
    place: "Copper Mountain, Colorado",
    coords: "39.5022° N · 106.1497° W",
    role: "Mountain Construction & Maintenance",
    org: "Copper Mountain Resort",
    date: "Jun 2023 — Sep 2023",
    body: "Field work above 9,700 ft. Equipment ops, crew coordination, schedules in shifting alpine weather. The mountain teaches you to plan twice and move once.",
    image: copper,
  },
  {
    id: "eugene",
    index: "03",
    place: "Eugene, Oregon",
    coords: "44.0521° N · 123.0868° W",
    role: "B.S. Economics · Pres. Alpine Ski Team",
    org: "University of Oregon",
    date: "2021 — Jun 2025",
    body: "Studied economics and entrepreneurship through Pacific fog. Led a 22-person ski team, ran a $25K seasonal budget, and qualified the team for Nationals.",
    image: eugene,
  },
  {
    id: "turning-point",
    index: "04",
    place: "Remote · Pacific Coast",
    coords: "—",
    role: "Business Development Intern",
    org: "Turning Point Pen Co.",
    date: "Jan 2024 — Jun 2024",
    body: "Cold outreach to luxury yachting, supercar, and high-end retail brands. Built a Salesforce pipeline and contributed to a 30% lift in client engagement.",
    image: eugene,
  },
  {
    id: "sydney",
    index: "05",
    place: "Sydney, Australia",
    coords: "33.8688° S · 151.2093° E",
    role: "Banking & Strategy Intern",
    org: "RFC Ambrian",
    date: "Aug 2025 — Sep 2025",
    body: "Designed the full structural framework for a clean energy, heavy industry, and deep tech startup incubator — phase gates, selection criteria, milestone funding. Presented directly to the CEO. Contributed to ARENA funding discussions.",
    image: sydney,
  },
  {
    id: "golden",
    index: "06",
    place: "Golden, Colorado",
    coords: "39.7555° N · 105.2211° W",
    role: "Professional Ski Boot Fitter",
    org: "Boot Mechanics",
    date: "Sep 2025 — Mar 2026",
    body: "Returned to the Front Range. Generated ~$80K in revenue over six months through consultative technical fittings — biomechanics, performance, fit.",
    image: golden,
  },
  {
    id: "boulder",
    index: "07",
    place: "Boulder, Colorado",
    coords: "40.0150° N · 105.2705° W",
    role: "M.Eng. Engineering Management (incoming)",
    org: "CU Boulder · Lockheed Martin Program",
    date: "Apr 2026 — May 2028",
    body: "The next station. Engineering management at the Lockheed Martin program — bridging finance, operations, and the physical systems that move the world.",
    image: boulder,
  },
];

export type Project = {
  slug: string;
  index: string;
  title: string;
  category: string;
  status: string;
  blurb: string;
};

export const PROJECTS: Project[] = [
  { slug: "incubator-framework", index: "01", title: "Clean Energy Incubator Framework", category: "Strategy · Program Design", status: "Case Study", blurb: "Phase gates, selection criteria, and milestone-based funding cycles for a deep tech incubator." },
  { slug: "hydrogen-market", index: "02", title: "Hydrogen Sector Intelligence", category: "Market Research", status: "Case Study", blurb: "Sector analysis across energy, mining, and industrials — synthesized into client-ready briefings." },
  { slug: "arena-funding", index: "03", title: "ARENA Funding Mechanism Map", category: "Public Finance", status: "Case Study", blurb: "Decoding Australian Renewable Energy Agency funding flows and program eligibility." },
  { slug: "ski-team-ops", index: "04", title: "USCSA Season Operations Model", category: "Operations · Budget", status: "Case Study", blurb: "Running a $25K budget and 6-trip season for 22 athletes across three states." },
  { slug: "boot-fit-system", index: "05", title: "Consultative Fit System", category: "Retail · Biomechanics", status: "Prototype", blurb: "A structured intake-to-fit-to-follow-up workflow for high-precision ski boot retail." },
  { slug: "swim-lane-toolkit", index: "06", title: "Swim Lane & Process Toolkit", category: "Process Design", status: "Toolkit", blurb: "Reusable patterns for mapping multi-stakeholder funding and program operations." },
  { slug: "alpine-data", index: "07", title: "Alpine Race Performance Data", category: "Sports Analytics", status: "Prototype", blurb: "An R-based analysis pipeline for SL/GS results, course conditions, and progression." },
  { slug: "facility-ops-playbook", index: "08", title: "Aquatic Facility Ops Playbook", category: "Operations · Safety", status: "Reference", blurb: "Daily ops, compliance, and scheduling patterns from three seasons running an aquatic facility." },
];
