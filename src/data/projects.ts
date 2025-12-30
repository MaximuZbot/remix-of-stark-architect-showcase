import skyindiaCrmImage from "@/assets/project-skyindia-crm.png";
import instagramAnalyticsImage from "@/assets/project-instagram-analytics.png";
import skyindiaWebsiteImage from "@/assets/project-skyindia-website.png";
import businessAutomationImage from "@/assets/project-business-automation.png";
import roleDashboardImage from "@/assets/project-role-dashboard.png";
import webToApkImage from "@/assets/project-web-to-apk.png";

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
  features?: string[];
  whyItMatters?: string;
}

export const projects: Project[] = [
  {
    slug: "skyindia-website",
    title: "SkyIndia Mattress – Website",
    description: "Full company website with product catalog and brand identity",
    image: skyindiaWebsiteImage,
    category: "Web Development",
    techStack: ["React", "Tailwind CSS", "Firebase Hosting"],
    challenge: "SkyIndia Mattress needed a modern online presence that showcased their product range while maintaining brand consistency across all touchpoints.",
    solution: "Built a responsive, SEO-optimized website with a comprehensive product catalog, intuitive navigation, and integrated brand guidelines throughout the design system.",
    results: "Increased online visibility and provided customers with easy access to product information and company details."
  },
  {
    slug: "skyindia-crm",
    title: "SkyIndia Mattress — Calculator & CRM App",
    description: "Custom pricing calculator and internal customer relationship management system",
    image: skyindiaCrmImage,
    category: "Business Tools",
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
      "Role-based access for staff and managers"
    ],
    whyItMatters: "This project focused on translating real-world store workflows into a reliable internal system. The goal was not to build a generic app, but to create a practical tool that staff could rely on during daily operations."
  },
  {
    slug: "instagram-analytics",
    title: "Instagram Analytics Automation Tool",
    description: "Automated computer vision pipeline for extracting engagement data from Instagram screenshots",
    image: instagramAnalyticsImage,
    category: "Automation",
    techStack: ["Python", "YOLO (custom-trained)", "OpenCV", "Pandas", "Google Drive", "Google Sheets API", "RunPod (GPU)"],
    challenge: "Manually extracting engagement metrics from Instagram screenshots was slow, repetitive, and prone to errors, especially when working with large volumes of data.",
    solution: "Built an automated system that processes Instagram screenshots in bulk and extracts engagement metrics directly from images using a custom-trained YOLO model.\n\nThe pipeline removes the need for manual data entry or platform APIs by relying entirely on visual analysis.",
    results: "The tool significantly reduced manual effort and enabled faster analysis of historical engagement data.\n\nTeams were able to make data-informed decisions using structured outputs generated directly from visual inputs.",
    features: [
      "Accepts screenshots via drag-and-drop or Google Drive links",
      "Processes hundreds or thousands of images in batches",
      "Detects likes, comments, and shares using computer vision",
      "Structures the extracted data automatically",
      "Outputs results with references to the original images"
    ]
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
    image: businessAutomationImage,
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
    image: roleDashboardImage,
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
    image: webToApkImage,
    category: "Mobile Development",
    techStack: ["React", "Capacitor", "Android Studio", "Firebase"],
    challenge: "Client needed a mobile app but wanted to leverage web development speed and cross-platform capabilities.",
    solution: "Developed the app as a progressive web app, then wrapped it with Capacitor for native Android deployment with full native feature access.",
    results: "Delivered production APK in half the time of traditional native development."
  }
];
