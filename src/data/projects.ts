import skyindiaCrmImage from "@/assets/project-skyindia-crm.png";

// Real website screenshots
import siteSkyindia from "@/assets/site-skyindia.png";
import siteThinkxyz from "@/assets/site-thinkxyz.png";
import siteMewlayer from "@/assets/site-mewlayer.png";
import sitePhilono from "@/assets/site-philono.png";
import siteSchool from "@/assets/site-school.png";
import siteSunverge from "@/assets/site-sunverge.png";
import siteMentra from "@/assets/site-mentra.png";

// Technical system diagrams
import diagramInstagram from "@/assets/diagram-instagram-analytics.jpg";
import diagramOcr from "@/assets/diagram-ocr-pipeline.jpg";
import diagramYolo from "@/assets/diagram-yolo.jpg";
import diagramAutomation from "@/assets/diagram-automation.jpg";
import diagramDashboard from "@/assets/diagram-dashboard.jpg";
import diagramWebToApk from "@/assets/diagram-web-to-apk.jpg";

export type ProjectTier = "live" | "prototype" | "system";

export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tier: ProjectTier;
  techStack: string[];
  challenge: string;
  solution: string;
  results: string;
  features?: string[];
  whyItMatters?: string;
  /** External deployed URL — surfaced only via a "Visit Website" button, never as raw text */
  liveUrl?: string;
  /** Short status label, e.g. "Live Production Website" or "Core Technology" */
  status?: string;
  /** Slugs of projects this one is built from (relationship rows on system cards) */
  builtFrom?: string[];
  /** Slug of the project that consumes this one as foundational tech */
  usedBy?: string;
  /** Slugs of related projects/websites (e.g. earlier platform versions) */
  relatedSlugs?: string[];
}

export const projects: Project[] = [
  // ─────────────────────────────────────────────
  // SECTION 1 — LIVE WEBSITES
  // ─────────────────────────────────────────────
  {
    slug: "skyindia-website",
    title: "SkyIndia Mattress",
    description: "Complete company website with product catalogue, branding, and responsive implementation.",
    image: siteSkyindia,
    category: "Live Website",
    tier: "live",
    status: "Live Production Website",
    liveUrl: "https://skyindiamattress.in/",
    techStack: ["React", "Tailwind CSS", "Firebase Hosting"],
    challenge: "SkyIndia Mattress needed a modern online presence that showcased their full product range while keeping brand consistency across every touchpoint.",
    solution: "Built and deployed a responsive, SEO-optimized website with a complete product catalogue, intuitive navigation, and a brand-aligned design system.",
    results: "A live, publicly accessible website that gives customers easy access to products and strengthens the company's online credibility.",
    features: [
      "Full product catalogue",
      "Brand identity and design system",
      "Responsive across all devices",
      "SEO-optimized structure",
    ],
  },
  {
    slug: "thinkxyz-prints",
    title: "Think XYZ Prints",
    description: "Deployed e-commerce-style 3D printing brand site with gallery, services, and ordering touchpoints.",
    image: siteThinkxyz,
    category: "Live Website",
    tier: "live",
    status: "Live Production Website",
    liveUrl: "https://thinkxyz.in/",
    techStack: ["React", "Tailwind CSS", "Netlify"],
    challenge: "A 3D printing service needed a bold storefront to present its work, communicate pricing, and convert visitors into orders.",
    solution: "Designed and shipped a high-contrast brand site with a scrolling product gallery, service breakdown, and direct ordering/WhatsApp touchpoints.",
    results: "A live brand presence that turns browsers into buyers and centralizes the print ordering journey.",
    features: [
      "Scrolling product gallery",
      "Service and pricing presentation",
      "Direct ordering touchpoints",
      "Bold, conversion-focused branding",
    ],
  },
  {
    slug: "mewlayer-labs",
    title: "Mew Layer Labs",
    description: "Experimental 3D printing studio site with an expressive, motion-driven brand identity.",
    image: siteMewlayer,
    category: "Live Website",
    tier: "live",
    status: "Live Production Website",
    liveUrl: "https://mewlayerlabs.netlify.app/",
    techStack: ["React", "Tailwind CSS", "Netlify"],
    challenge: "An experimental studio wanted a website that felt as playful and distinctive as its work, without looking like a template.",
    solution: "Built a deployed site with a strong typographic hero, animated marquees, and a curated product showcase that expresses the studio's personality.",
    results: "A live, memorable brand site that stands apart from generic studio templates.",
    features: [
      "Expressive typographic hero",
      "Animated brand elements",
      "Curated product showcase",
      "Distinctive visual identity",
    ],
  },
  {
    slug: "philono",
    title: "Philono",
    description: "Deployed analytics workspace that turns uploaded screenshots into structured visual data.",
    image: sitePhilono,
    category: "Live Website",
    tier: "live",
    status: "Live Production Web App",
    liveUrl: "https://philono.netlify.app/",
    techStack: ["React", "Tailwind CSS", "Netlify"],
    challenge: "Turning visual data from screenshots into actionable insight usually requires manual entry or platform APIs.",
    solution: "Shipped a polished web workspace where users drag-and-drop screenshots (or paste a Drive link) and walk through a guided extraction-to-insight flow — the product face of the screenshot-to-data automation work.",
    results: "A live application that packages the underlying OCR and computer-vision automation into a usable product experience.",
    relatedSlugs: ["instagram-analytics"],
    features: [
      "Drag-and-drop screenshot upload",
      "Google Drive folder ingestion",
      "Guided extraction workflow",
      "Structured insight output",
    ],
    whyItMatters: "Philono represents an earlier, productized version of the automation workflow that powers the Instagram Analytics tool — the same engine, presented as a polished web app.",
  },

  // ─────────────────────────────────────────────
  // SECTION 2 — PROTOTYPES & CONCEPTS
  // ─────────────────────────────────────────────
  {
    slug: "school-website",
    title: "School Website",
    description: "Concept build validating structure, navigation, and design direction for an education brand.",
    image: siteSchool,
    category: "Prototype",
    tier: "prototype",
    status: "Client Concept",
    liveUrl: "https://schoolwebsitev10.netlify.app/",
    techStack: ["React", "Tailwind CSS", "Netlify"],
    challenge: "Before committing to a full school website, the structure, navigation, and tone needed validation.",
    solution: "Built a complete concept site covering admissions, academics, facilities, and blog flows to test the information architecture.",
    results: "A working reference used to align on structure and direction before production.",
  },
  {
    slug: "sunverge",
    title: "SunVerge",
    description: "Concept solar-energy site with an interactive multi-step savings calculator.",
    image: siteSunverge,
    category: "Prototype",
    tier: "prototype",
    status: "Concept Website",
    liveUrl: "https://sunverge.netlify.app/",
    techStack: ["React", "Tailwind CSS", "Netlify"],
    challenge: "A solar brand concept needed an engaging way to turn curiosity into qualified leads.",
    solution: "Prototyped a clean marketing site anchored by an interactive, step-based solar savings calculator.",
    results: "A concept that demonstrates lead-gen flow and product storytelling in one experience.",
  },
  {
    slug: "mentra",
    title: "Mentra",
    description: "Personal product exploration for a tutor-matching marketplace concept.",
    image: siteMentra,
    category: "Prototype",
    tier: "prototype",
    status: "Personal Product Exploration",
    liveUrl: "https://mentra-professional-lv26.bolt.host",
    techStack: ["React", "Tailwind CSS", "Bolt"],
    challenge: "Exploring how a trusted tutor-matching marketplace could be positioned and structured.",
    solution: "Built a product concept covering parent and tutor journeys, trust signals, and a waitlist flow.",
    results: "A self-initiated exploration of product positioning and onboarding for a marketplace idea.",
  },

  // ─────────────────────────────────────────────
  // SECTION 3 — AI, AUTOMATION & COMPUTER VISION
  // ─────────────────────────────────────────────
  {
    slug: "instagram-analytics",
    title: "Instagram Analytics Automation Tool",
    description: "Production workflow that uses OCR, computer vision, and automation to extract engagement data from screenshots.",
    image: diagramInstagram,
    category: "Automation Workflow",
    tier: "system",
    status: "Production Workflow",
    builtFrom: ["ocr-pipeline"],
    relatedSlugs: ["philono"],
    techStack: ["Python", "YOLO (custom-trained)", "OpenCV", "Pandas", "Google Drive", "Google Sheets API", "RunPod (GPU)"],
    challenge: "Manually extracting engagement metrics from Instagram screenshots was slow, repetitive, and error-prone at scale.",
    solution: "Built an automated workflow that combines the Screenshot-to-Data OCR pipeline, custom vision processing, and an analytics automation engine to read engagement directly from images — no platform APIs required.",
    results: "Drastically reduced manual effort and enabled fast analysis of large volumes of historical engagement data.",
    features: [
      "Accepts screenshots via drag-and-drop or Google Drive links",
      "Processes hundreds or thousands of images in batches",
      "Detects likes, comments, and shares using computer vision",
      "Structures the extracted data automatically",
      "Outputs results with references to the original images",
    ],
    whyItMatters: "This is not a single model — it is an orchestrated system. It is built on top of the Screenshot-to-Data OCR Pipeline and shares its engine with the Philono web app.",
  },
  {
    slug: "ocr-pipeline",
    title: "Screenshot-to-Data OCR Pipeline",
    description: "Core OCR extraction technology that converts screenshots and image-based information into structured datasets.",
    image: diagramOcr,
    category: "Core Technology",
    tier: "system",
    status: "Core Technology",
    usedBy: "instagram-analytics",
    techStack: ["Python", "Tesseract OCR", "OpenCV", "Pandas"],
    challenge: "Business data trapped in screenshots and images needed to be converted into usable, structured formats for analysis.",
    solution: "Built a robust OCR pipeline with image preprocessing, text extraction, and intelligent parsing that turns visual data into structured CSV/JSON output.",
    results: "Automated data extraction from 1000+ images with 95%+ accuracy — and became the foundation for higher-level automation tools.",
    whyItMatters: "This is the foundational extraction layer. The Instagram Analytics Automation Tool is built directly on top of it.",
  },
  {
    slug: "yolo-detection",
    title: "Custom YOLO Object Detection System",
    description: "Trained YOLOv8 models for domain-specific object detection tasks.",
    image: diagramYolo,
    category: "Computer Vision",
    tier: "system",
    status: "Capability Showcase",
    techStack: ["Python", "YOLOv8", "OpenCV", "PyTorch"],
    challenge: "Standard object detection models weren't accurate enough for specialized industrial use cases requiring custom object recognition.",
    solution: "Collected and annotated domain-specific datasets, trained custom YOLOv8 models, and deployed optimized inference pipelines.",
    results: "Achieved 92% mAP on custom objects with real-time inference at 30+ FPS.",
  },
  {
    slug: "business-automation",
    title: "Internal Business Automation Tools",
    description: "Suite of automation scripts replacing manual business workflows.",
    image: diagramAutomation,
    category: "Automation",
    tier: "system",
    status: "Capability Showcase",
    techStack: ["Python", "Google APIs", "Selenium", "cron"],
    challenge: "Repetitive manual tasks were consuming significant employee time and introducing human errors in critical business processes.",
    solution: "Developed a suite of automation scripts covering data entry, report generation, file organization, and cross-platform synchronization.",
    results: "Eliminated 20+ hours of manual work weekly across the organization.",
  },
  {
    slug: "skyindia-crm",
    title: "SkyIndia Mattress — Calculator & CRM App",
    description: "Custom pricing calculator and internal customer relationship management system.",
    image: skyindiaCrmImage,
    category: "Internal Tool",
    tier: "system",
    status: "Internal Business Tool",
    techStack: ["React", "Firebase", "Firestore", "Cloud Functions"],
    challenge: "The in-store sales team relied on manual calculations and disconnected tools to handle pricing, inventory tracking, and customer records.\n\nThis made custom pricing error-prone, slowed down sales workflows, and made it difficult to maintain a single source of truth across staff devices.",
    solution: "Designed and built a centralized in-store application that combines dynamic pricing logic, sales tracking, inventory visibility, and CRM functionality into a single system.\n\nThe app synchronizes data in real time across devices and supports role-based access, allowing staff to work collaboratively while maintaining data consistency.",
    results: "The system significantly reduced manual errors, improved pricing accuracy, and streamlined day-to-day in-store operations.\n\nStaff were able to collaborate more efficiently using a shared, synchronized data source, reducing operational overhead and improving overall sales efficiency.",
    features: [
      "Real-time sales recording and tracking",
      "Inventory movement and stock visibility",
      "Cost, margin, and profitability calculations",
      "Built-in customer relationship management",
      "Quotation generation and warranty record handling",
      "Multi-device synchronization",
      "Role-based access for staff and managers",
    ],
    whyItMatters: "This project focused on translating real-world store workflows into a reliable internal system. The goal was not to build a generic app, but to create a practical tool that staff could rely on during daily operations.",
  },
  {
    slug: "role-based-dashboard",
    title: "Role-Based Business Dashboard",
    description: "Multi-role dashboard with authentication and real-time data sync.",
    image: diagramDashboard,
    category: "Internal Tool",
    tier: "system",
    status: "Internal Business Tool",
    techStack: ["React", "Firebase Auth", "Firestore", "Tailwind CSS"],
    challenge: "Different team roles needed access to different data views and actions, requiring a flexible permission system.",
    solution: "Built a modular dashboard with authentication, role-based access control, and real-time data synchronization across all views.",
    results: "Unified team operations with secure, role-appropriate data access for 5+ user roles.",
  },
  {
    slug: "web-to-apk",
    title: "End-to-End App Delivery (Web → APK)",
    description: "Complete app development from web prototype to production APK.",
    image: diagramWebToApk,
    category: "Mobile Delivery",
    tier: "system",
    status: "Capability Showcase",
    techStack: ["React", "Capacitor", "Android Studio", "Firebase"],
    challenge: "Client needed a mobile app but wanted to leverage web development speed and cross-platform capabilities.",
    solution: "Developed the app as a progressive web app, then wrapped it with Capacitor for native Android deployment with full native feature access.",
    results: "Delivered production APK in half the time of traditional native development.",
  },
];

export const liveProjects = projects.filter((p) => p.tier === "live");
export const prototypeProjects = projects.filter((p) => p.tier === "prototype");
export const systemProjects = projects.filter((p) => p.tier === "system");

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
