import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TechStack = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: itemsRef, isVisible: itemsVisible } = useScrollAnimation();

  const technologies = [
    "Python",
    "Firebase",
    "YOLOv8 / OpenCV",
    "OCR",
    "LLM APIs",
    "Web App Stacks",
    "Automation Scripts"
  ];

  return (
    <section id="tech" className="py-32 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={headerRef}
            className={`mb-20 transition-all duration-700 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-minimal text-muted-foreground mb-4">TECHNOLOGIES</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Tech Stack
            </h3>
          </div>
          
          <div 
            ref={itemsRef}
            className={`flex flex-wrap gap-4 transition-all duration-700 delay-200 ${
              itemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {technologies.map((tech, index) => (
              <div 
                key={index}
                className="px-6 py-3 border border-border bg-background hover:border-foreground/30 transition-colors duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-foreground">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
