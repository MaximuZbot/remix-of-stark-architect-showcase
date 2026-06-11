import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  siClaude,
  siGooglegemini,
  siOllama,
  siPython,
  siOpencv,
  siFirebase,
  siSupabase,
  siReact,
  siNextdotjs,
  siDocker,
  siGithub,
  siRazorpay,
  siStripe,
  siVercel,
} from "simple-icons";

type Tool = {
  name: string;
  /** SVG path data for a single-color logo */
  path?: string;
  /** Fallback uppercase wordmark when no brand icon exists */
  wordmark?: string;
};

// OpenAI is not available in simple-icons (trademark) — use the official mark path.
const openAiPath =
  "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z";

const rowOne: Tool[] = [
  { name: "OpenAI", path: openAiPath },
  { name: "Claude", path: siClaude.path },
  { name: "Gemini", path: siGooglegemini.path },
  { name: "Ollama", path: siOllama.path },
  { name: "Python", path: siPython.path },
  { name: "YOLO", wordmark: "YOLO" },
  { name: "OpenCV", path: siOpencv.path },
  { name: "Firebase", path: siFirebase.path },
  { name: "Supabase", path: siSupabase.path },
];

const rowTwo: Tool[] = [
  { name: "React", path: siReact.path },
  { name: "Next.js", path: siNextdotjs.path },
  { name: "Docker", path: siDocker.path },
  { name: "GitHub", path: siGithub.path },
  { name: "Razorpay", path: siRazorpay.path },
  { name: "Stripe", path: siStripe.path },
  { name: "Vercel", path: siVercel.path },
  { name: "Fusion 360", wordmark: "Fusion 360" },
];

const LogoItem = ({ tool }: { tool: Tool }) => (
  <div className="group/item flex flex-col items-center justify-center gap-3 px-8 md:px-12 shrink-0">
    <div className="h-10 flex items-center justify-center text-white/60 transition-all duration-300 group-hover/item:text-white group-hover/item:[filter:drop-shadow(0_0_10px_rgba(255,255,255,0.55))]">
      {tool.path ? (
        <svg
          role="img"
          aria-label={tool.name}
          viewBox="0 0 24 24"
          className="h-9 w-9"
          fill="currentColor"
        >
          <path d={tool.path} />
        </svg>
      ) : (
        <span className="text-2xl font-display font-extrabold uppercase tracking-tight whitespace-nowrap">
          {tool.wordmark}
        </span>
      )}
    </div>
    <span className="text-xs font-medium uppercase tracking-wider text-white/0 transition-all duration-300 group-hover/item:text-white/70 whitespace-nowrap">
      {tool.name}
    </span>
  </div>
);

const MarqueeRow = ({
  tools,
  direction,
}: {
  tools: Tool[];
  direction: "left" | "right";
}) => (
  <div className="marquee-group marquee-mask overflow-hidden">
    <div
      className={`marquee-track ${
        direction === "left" ? "marquee-left" : "marquee-right"
      }`}
    >
      {[...tools, ...tools].map((tool, i) => (
        <LogoItem key={`${tool.name}-${i}`} tool={tool} />
      ))}
    </div>
  </div>
);

const TechStack = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: rowsRef, isVisible: rowsVisible } = useScrollAnimation();

  return (
    <section id="tech" className="py-32 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div
            ref={headerRef}
            className={`mb-16 transition-all duration-700 ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-minimal text-white/50 mb-4">THE ARSENAL</h2>
            <h3 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter text-white">
              Tools of the Trade
            </h3>
          </div>
        </div>
      </div>

      <div
        ref={rowsRef}
        className={`flex flex-col gap-10 transition-all duration-700 delay-200 ${
          rowsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <MarqueeRow tools={rowOne} direction="left" />
        <MarqueeRow tools={rowTwo} direction="right" />
      </div>
    </section>
  );
};

export default TechStack;
