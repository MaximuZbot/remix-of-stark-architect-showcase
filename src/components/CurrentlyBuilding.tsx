const CurrentlyBuilding = () => {
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
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">IN PROGRESS</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Currently Building
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {currentProjects.map((project, index) => (
              <div key={index} className="border-l-2 border-architectural pl-6">
                <h4 className="text-xl font-medium mb-3">{project.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentlyBuilding;
