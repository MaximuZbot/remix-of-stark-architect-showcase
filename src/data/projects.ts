export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  techStack: string[];
  challenge: string;
  solution: string;
  results: string;
}

export const projects: Project[] = [
  {
    slug: "skyindia-website",
    title: "SkyIndia Mattress – Website",
    description: "Full company website with product catalog and brand identity",
    image: "/placeholder.svg",
    category: "Web Development",
    techStack: ["React", "Tailwind CSS", "Firebase Hosting"],
    challenge: "SkyIndia Mattress needed a modern online presence that showcased their product range while maintaining brand consistency across all touchpoints.",
    solution: "Built a responsive, SEO-optimized website with a comprehensive product catalog, intuitive navigation, and integrated brand guidelines throughout the design system.",
    results: "Increased online visibility and provided customers with easy access to product information and company details."
  },
  {
    slug: "skyindia-crm",
    title: "SkyIndia Mattress – Calculator & CRM App",
    description: "Custom pricing calculator and customer relationship management system",
    image: "/placeholder.svg",
    category: "Business Tools",
    techStack: ["React", "Firebase", "Firestore", "Cloud Functions"],
    challenge: "The sales team needed a streamlined way to calculate custom mattress pricing and manage customer relationships without switching between multiple tools.",
    solution: "Developed an integrated app combining a dynamic pricing calculator with CRM functionality, featuring real-time sync and role-based access control.",
    results: "Reduced pricing errors by 90% and improved sales team efficiency with centralized customer data."
  },
  {
    slug: "instagram-analytics",
    title: "Instagram Analytics Automation Tool",
    description: "Automated data extraction and analytics pipeline for Instagram insights",
    image: "/placeholder.svg",
    category: "Automation",
    techStack: ["Python", "Selenium", "Pandas", "Google Sheets API"],
    challenge: "Manual extraction of Instagram analytics was time-consuming and prone to errors, making it difficult to track performance trends.",
    solution: "Created an automated pipeline that extracts engagement metrics, processes the data, and generates comprehensive reports with trend analysis.",
    results: "Saved 10+ hours weekly on manual data entry and enabled data-driven content decisions."
  },
  {
    slug: "ocr-pipeline",
    title: "Screenshot-to-Data OCR Pipeline",
    description: "End-to-end OCR system converting screenshots into structured data",
    image: "/placeholder.svg",
    category: "Computer Vision",
    techStack: ["Python", "Tesseract OCR", "OpenCV", "Pandas"],
    challenge: "Business data trapped in screenshots and images needed to be converted to usable structured formats for analysis.",
    solution: "Built a robust OCR pipeline with image preprocessing, text extraction, and intelligent parsing to convert visual data into structured CSV/JSON outputs.",
    results: "Automated data extraction from 1000+ images with 95%+ accuracy."
  },
  {
    slug: "yolo-detection",
    title: "Custom YOLO Object Detection System",
    description: "Trained YOLOv8 models for domain-specific object detection tasks",
    image: "/placeholder.svg",
    category: "Computer Vision",
    techStack: ["Python", "YOLOv8", "OpenCV", "PyTorch"],
    challenge: "Standard object detection models weren't accurate enough for specialized industrial use cases requiring custom object recognition.",
    solution: "Collected and annotated domain-specific datasets, trained custom YOLOv8 models, and deployed optimized inference pipelines.",
    results: "Achieved 92% mAP on custom objects with real-time inference at 30+ FPS."
  },
  {
    slug: "business-automation",
    title: "Internal Business Automation Tools",
    description: "Suite of automation scripts replacing manual business workflows",
    image: "/placeholder.svg",
    category: "Automation",
    techStack: ["Python", "Google APIs", "Selenium", "cron"],
    challenge: "Repetitive manual tasks were consuming significant employee time and introducing human errors in critical business processes.",
    solution: "Developed a suite of automation scripts covering data entry, report generation, file organization, and cross-platform synchronization.",
    results: "Eliminated 20+ hours of manual work weekly across the organization."
  },
  {
    slug: "role-based-dashboard",
    title: "Role-Based Business Dashboard",
    description: "Multi-role dashboard with Firebase auth and real-time data sync",
    image: "/placeholder.svg",
    category: "Web Development",
    techStack: ["React", "Firebase Auth", "Firestore", "Tailwind CSS"],
    challenge: "Different team roles needed access to different data views and actions, requiring a flexible permission system.",
    solution: "Built a modular dashboard with Firebase authentication, role-based access control, and real-time data synchronization across all views.",
    results: "Unified team operations with secure, role-appropriate data access for 5+ user roles."
  },
  {
    slug: "web-to-apk",
    title: "End-to-End App Delivery (Web → APK)",
    description: "Complete app development from web prototype to production APK",
    image: "/placeholder.svg",
    category: "Mobile Development",
    techStack: ["React", "Capacitor", "Android Studio", "Firebase"],
    challenge: "Client needed a mobile app but wanted to leverage web development speed and cross-platform capabilities.",
    solution: "Developed the app as a progressive web app, then wrapped it with Capacitor for native Android deployment with full native feature access.",
    results: "Delivered production APK in half the time of traditional native development."
  }
];
