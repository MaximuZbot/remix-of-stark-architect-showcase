import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CurrentlyBuilding = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  const currentProjects = [
    {
      title: "Mentra",
      description: "AI-assisted tutoring platform (solo rebuild)"
    },
    {
      title: "AI-Powered Mini-ERP Modules",
      description: "Lightweight ERP components for small businesses"
    },
    {
      title: "Computer Vision Tools",
      description: "Custom YOLO models for specialized detection tasks"
    }
  ];

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={headerRef}
            className={`mb-20 transition-all duration-700 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-minimal text-muted-foreground mb-4">IN PROGRESS</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Currently Building
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {currentProjects.map((project, index) => (
              <CurrentProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CurrentProjectCard = ({ project, index }: { project: { title: string; description: string }; index: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div 
      ref={ref}
      className={`border-l-2 border-architectural pl-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <h4 className="text-xl font-medium mb-3">{project.title}</h4>
      <p className="text-muted-foreground leading-relaxed">
        {project.description}
      </p>
    </div>
  );
};

export default CurrentlyBuilding;
