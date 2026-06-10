import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, GitBranch, Layers } from "lucide-react";
import Navigation from "@/components/Navigation";
import {
  Project,
  liveProjects,
  prototypeProjects,
  systemProjects,
  getProjectBySlug,
} from "@/data/projects";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Projects = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div
            ref={headerRef}
            className={`max-w-7xl mx-auto transition-all duration-700 ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-minimal text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <span>←</span>
              <span>BACK</span>
            </Link>
            <h1 className="text-minimal text-muted-foreground mb-4">SELECTED WORK</h1>
            <h2 className="text-4xl md:text-6xl font-light text-architectural max-w-3xl">
              Real websites, shipped products, and the systems behind them.
            </h2>
            <p className="text-xl text-muted-foreground mt-6 max-w-2xl">
              Production websites that are live today, prototype explorations, and the
              automation, AI, and computer-vision systems I build under the hood.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 1 — LIVE WEBSITES */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              index="01"
              label="LIVE WEBSITES"
              title="Live & Publicly Accessible"
              caption="Deployed, real websites — not concepts. Visit them yourself."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-12">
              {liveProjects.map((project, index) => (
                <LiveWebsiteCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROTOTYPES & CONCEPTS */}
      <section className="pb-24 md:pb-32 bg-muted/40 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              index="02"
              label="PROTOTYPES & CONCEPTS"
              title="Explorations & Concept Builds"
              caption="Experimental and concept work — built to validate ideas and direction."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-12">
              {prototypeProjects.map((project, index) => (
                <PrototypeCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — AI, AUTOMATION & COMPUTER VISION */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              index="03"
              label="AI, AUTOMATION & COMPUTER VISION"
              title="Technical Systems"
              caption="The engines under the hood — and how they connect to each other."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-12">
              {systemProjects.map((project, index) => (
                <SystemCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SectionHeading = ({
  index,
  label,
  title,
  caption,
}: {
  index: string;
  label: string;
  title: string;
  caption: string;
}) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border pb-6 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex items-baseline gap-4">
        <span className="text-minimal text-muted-foreground">{index}</span>
        <div>
          <p className="text-minimal text-muted-foreground mb-2">{label}</p>
          <h3 className="text-3xl md:text-5xl font-light text-architectural">{title}</h3>
        </div>
      </div>
      <p className="text-muted-foreground max-w-sm md:text-right">{caption}</p>
    </div>
  );
};

const VisitButton = ({ url, subtle = false }: { url: string; subtle?: boolean }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    className={`inline-flex items-center gap-2 transition-all ${
      subtle
        ? "text-sm text-muted-foreground hover:text-foreground"
        : "px-5 py-3 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
    }`}
  >
    Visit Website
    <ArrowUpRight className="w-4 h-4" />
  </a>
);

const LiveWebsiteCard = ({ project, index }: { project: Project; index: number }) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group relative flex flex-col bg-background border border-border hover:border-foreground/30 hover:shadow-elegant transition-all duration-500 overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${(index % 2) * 100}ms` }}
    >
      <Link to={`/project/${project.slug}`} className="block overflow-hidden">
        <div className="aspect-[16/10] overflow-hidden bg-muted relative">
          <img
            src={project.image}
            alt={`${project.title} live website`}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 bg-background/90 backdrop-blur text-minimal">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
            {project.status}
          </span>
        </div>
      </Link>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <Link to={`/project/${project.slug}`}>
          <h4 className="text-2xl md:text-3xl font-light text-architectural group-hover:text-muted-foreground transition-colors">
            {project.title}
          </h4>
        </Link>
        <p className="text-muted-foreground leading-relaxed mt-3 flex-1">
          {project.description}
        </p>
        <div className="flex items-center justify-between gap-4 mt-6">
          {project.liveUrl && <VisitButton url={project.liveUrl} />}
          <Link
            to={`/project/${project.slug}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            Case study <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const PrototypeCard = ({ project, index }: { project: Project; index: number }) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group flex flex-col bg-background border border-border hover:border-foreground/20 transition-all duration-500 overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <Link to={`/project/${project.slug}`} className="block overflow-hidden">
        <div className="aspect-[16/11] overflow-hidden bg-muted">
          <img
            src={project.image}
            alt={`${project.title} concept`}
            loading="lazy"
            className="w-full h-full object-cover object-top grayscale opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {project.status}
        </span>
        <Link to={`/project/${project.slug}`}>
          <h4 className="text-lg font-light text-architectural mt-1 group-hover:text-muted-foreground transition-colors">
            {project.title}
          </h4>
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2 flex-1">
          {project.description}
        </p>
        {project.liveUrl && (
          <div className="mt-4">
            <VisitButton url={project.liveUrl} subtle />
          </div>
        )}
      </div>
    </div>
  );
};

const RelationshipRow = ({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  items: { slug: string; title: string }[];
}) => (
  <div className="flex items-start gap-3 text-sm">
    <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 mt-0.5">
      {icon}
      <span className="text-minimal">{label}</span>
    </span>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.slug}
          to={`/project/${item.slug}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 border border-border hover:border-foreground hover:bg-muted transition-colors text-foreground"
        >
          {item.title}
          <ArrowRight className="w-3 h-3" />
        </Link>
      ))}
    </div>
  </div>
);

const SystemCard = ({ project, index }: { project: Project; index: number }) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  const builtFrom = (project.builtFrom ?? [])
    .map(getProjectBySlug)
    .filter(Boolean) as Project[];
  const usedByProject = project.usedBy ? getProjectBySlug(project.usedBy) : undefined;
  const related = (project.relatedSlugs ?? [])
    .map(getProjectBySlug)
    .filter(Boolean) as Project[];

  const isCoreTech = project.status === "Core Technology";
  const hasRelations = builtFrom.length > 0 || usedByProject || related.length > 0;

  return (
    <div
      ref={ref}
      className={`group flex flex-col bg-background border transition-all duration-500 overflow-hidden ${
        isCoreTech ? "border-foreground/30" : "border-border hover:border-foreground/20"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${(index % 2) * 100}ms` }}
    >
      <Link to={`/project/${project.slug}`} className="block overflow-hidden">
        <div className="aspect-[16/9] overflow-hidden bg-muted border-b border-border">
          <img
            src={project.image}
            alt={`${project.title} system diagram`}
            loading="lazy"
            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
      </Link>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          {isCoreTech && <Layers className="w-3.5 h-3.5" />}
          {project.status}
        </span>
        <Link to={`/project/${project.slug}`}>
          <h4 className="text-xl md:text-2xl font-light text-architectural mt-2 group-hover:text-muted-foreground transition-colors">
            {project.title}
          </h4>
        </Link>
        <p className="text-muted-foreground leading-relaxed mt-3 flex-1">
          {project.description}
        </p>

        {hasRelations && (
          <div className="mt-6 pt-5 border-t border-border space-y-3">
            {builtFrom.length > 0 && (
              <RelationshipRow
                icon={<GitBranch className="w-3.5 h-3.5" />}
                label="BUILT FROM"
                items={builtFrom}
              />
            )}
            {usedByProject && (
              <RelationshipRow
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                label="USED BY"
                items={[usedByProject]}
              />
            )}
            {related.length > 0 && (
              <RelationshipRow
                icon={<Layers className="w-3.5 h-3.5" />}
                label="RELATED"
                items={related}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
