import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Projects = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  return (
    <section id="projects" className="py-32 bg-muted">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={headerRef}
            className={`mb-20 transition-all duration-700 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-minimal text-muted-foreground mb-4">SELECTED WORK</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Projects
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const { ref, isVisible } = useScrollAnimation<HTMLAnchorElement>({ threshold: 0.1 });
  
  return (
    <Link 
      to={`/project/${project.slug}`}
      ref={ref}
      className={`group block bg-background border border-border hover:border-foreground/20 transition-all duration-500 overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-8">
        <div className="flex items-start space-x-4">
          <span className="text-minimal text-muted-foreground font-medium">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {project.category}
            </span>
            <h4 className="text-xl font-light text-architectural mb-3 group-hover:text-muted-foreground transition-colors duration-500">
              {project.title}
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Projects;
