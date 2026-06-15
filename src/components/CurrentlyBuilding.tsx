import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import bgCurrentlyBuilding from "@/assets/bg-currently-building.png";

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
    <section className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgCurrentlyBuilding})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/90" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={headerRef}
            className={`mb-20 transition-all duration-700 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-minimal text-white/60 mb-4">IN PROGRESS</h2>
            <h3 className="text-4xl md:text-6xl font-light text-white">
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
      className={`backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-500 hover:bg-white/10 hover:border-[#26ffff]/30 hover:shadow-[0_0_20px_rgba(38,255,255,0.08)] hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <h4 className="text-xl font-medium mb-3 text-white">{project.title}</h4>
      <p className="text-white/70 leading-relaxed">
        {project.description}
      </p>
    </div>
  );
};

export default CurrentlyBuilding;
