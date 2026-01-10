import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ProjectsPreview = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  
  // Show only first 4 projects as preview
  const featuredProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={headerRef}
            className={`flex flex-col md:flex-row md:justify-between md:items-end mb-12 transition-all duration-700 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">SELECTED WORK</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural">
                Projects
              </h3>
            </div>
            <Link 
              to="/projects"
              className="text-minimal text-muted-foreground hover:text-foreground transition-colors mt-6 md:mt-0"
            >
              VIEW ALL →
            </Link>
          </div>
          
          {/* Project List */}
          <div className="border-t border-border">
            {featuredProjects.map((project, index) => (
              <ProjectListItem key={project.slug} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectListItem = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const { ref, isVisible } = useScrollAnimation<HTMLAnchorElement>({ threshold: 0.1 });
  
  return (
    <Link 
      to={`/project/${project.slug}`}
      ref={ref}
      className={`group flex items-center justify-between py-6 border-b border-border hover:bg-background/50 transition-all duration-500 px-4 -mx-4 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-6 md:gap-12 flex-1 min-w-0">
        <span className="text-minimal text-muted-foreground font-medium w-8 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider w-32 shrink-0 hidden md:block">
          {project.category}
        </span>
        <h4 className="text-lg md:text-xl font-light text-foreground group-hover:text-muted-foreground transition-colors duration-300 truncate">
          {project.title}
        </h4>
      </div>
      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 ml-4">
        →
      </span>
    </Link>
  );
};

export default ProjectsPreview;
