const TechStack = () => {
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
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">TECHNOLOGIES</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Tech Stack
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {technologies.map((tech, index) => (
              <div 
                key={index}
                className="px-6 py-3 border border-border bg-background hover:border-foreground/30 transition-colors duration-300"
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
