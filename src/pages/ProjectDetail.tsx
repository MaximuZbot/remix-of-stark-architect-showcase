import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import { projects, Project, getProjectBySlug } from "@/data/projects";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const projectIndex = projects.findIndex(p => p.slug === slug);
  const project = projects[projectIndex];
  
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const prevProject = projects[(projectIndex - 1 + projects.length) % projects.length];

  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: navRef, isVisible: navVisible } = useScrollAnimation();

  if (!project) {
    navigate("/");
    return null;
  }

  const relatedSlugs = Array.from(
    new Set([
      ...(project.builtFrom ?? []),
      ...(project.usedBy ? [project.usedBy] : []),
      ...(project.relatedSlugs ?? []),
    ]),
  );
  const relatedProjects = relatedSlugs
    .map(getProjectBySlug)
    .filter((p): p is Project => Boolean(p));



  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-muted/20">
        <div 
          ref={heroRef}
          className={`container mx-auto px-6 transition-all duration-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/projects" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-minimal text-muted-foreground">{project.category}</span>
                <h1 className="text-4xl md:text-6xl font-light text-architectural mt-4 mb-6">
                  {project.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Visit Website
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}

                <div className="mt-8">
                  <h4 className="text-minimal text-muted-foreground mb-3">TECH STACK</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <span 
                        key={i}
                        className="px-4 py-2 border border-border bg-background text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="aspect-[4/3] bg-muted border border-border overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className={`w-full h-full ${project.tier === "system" ? "object-contain p-6 bg-background" : "object-cover object-top"}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Content */}
      <section className="py-32">
        <div 
          ref={contentRef}
          className={`container mx-auto px-6 transition-all duration-700 delay-200 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-4xl mx-auto space-y-20">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">THE CHALLENGE</h2>
              <div className="text-2xl font-light text-architectural leading-relaxed space-y-4">
                {project.challenge.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">THE SOLUTION</h2>
              <div className="text-2xl font-light text-architectural leading-relaxed space-y-4">
                {project.solution.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="text-minimal text-muted-foreground mb-6">
                  {project.slug === "instagram-analytics" ? "WHAT THE SYSTEM DOES" : "KEY CAPABILITIES"}
                </h2>
                <ul className="grid md:grid-cols-2 gap-4">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-3 flex-shrink-0" />
                      <span className="text-lg text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">THE RESULTS</h2>
              <div className="text-2xl font-light text-architectural leading-relaxed space-y-4">
                {project.results.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {project.whyItMatters && (
              <div>
                <h2 className="text-minimal text-muted-foreground mb-4">WHY THIS PROJECT MATTERS</h2>
                <p className="text-2xl font-light text-architectural leading-relaxed">
                  {project.whyItMatters}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="pb-24 border-t border-border pt-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-minimal text-muted-foreground mb-8">RELATED PROJECTS</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {relatedProjects.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/project/${related.slug}`}
                    className="group p-6 border border-border hover:border-foreground/30 transition-colors"
                  >
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {related.status ?? related.category}
                    </span>
                    <h3 className="text-xl font-light text-architectural mt-2 group-hover:text-muted-foreground transition-colors flex items-center justify-between gap-2">
                      {related.title}
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {related.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}



      {/* Project Navigation */}
      <section className="py-20 border-t border-border">
        <div 
          ref={navRef}
          className={`container mx-auto px-6 transition-all duration-700 ${
            navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Link 
                to={`/project/${prevProject.slug}`}
                className="group p-8 border border-border hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-center text-muted-foreground mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="text-minimal">PREVIOUS PROJECT</span>
                </div>
                <h3 className="text-xl font-light group-hover:text-muted-foreground transition-colors">
                  {prevProject.title}
                </h3>
              </Link>
              
              <Link 
                to={`/project/${nextProject.slug}`}
                className="group p-8 border border-border hover:border-foreground/20 transition-colors text-right"
              >
                <div className="flex items-center justify-end text-muted-foreground mb-4">
                  <span className="text-minimal">NEXT PROJECT</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
                <h3 className="text-xl font-light group-hover:text-muted-foreground transition-colors">
                  {nextProject.title}
                </h3>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
