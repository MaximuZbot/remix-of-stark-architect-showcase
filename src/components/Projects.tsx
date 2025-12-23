const Projects = () => {
  const projects = [
    {
      title: "SkyIndia Mattress – Website",
      description: "Full company website with product catalog and brand identity"
    },
    {
      title: "SkyIndia Mattress – Calculator & CRM App",
      description: "Custom pricing calculator and customer relationship management system"
    },
    {
      title: "Instagram Analytics Automation Tool",
      description: "Automated data extraction and analytics pipeline for Instagram insights"
    },
    {
      title: "Screenshot-to-Data OCR Pipeline",
      description: "End-to-end OCR system converting screenshots into structured data"
    },
    {
      title: "Custom YOLO Object Detection System",
      description: "Trained YOLOv8 models for domain-specific object detection tasks"
    },
    {
      title: "Internal Business Automation Tools",
      description: "Suite of automation scripts replacing manual business workflows"
    },
    {
      title: "Role-Based Business Dashboard",
      description: "Multi-role dashboard with Firebase auth and real-time data sync"
    },
    {
      title: "End-to-End App Delivery (Web → APK)",
      description: "Complete app development from web prototype to production APK"
    }
  ];

  return (
    <section id="projects" className="py-32 bg-muted">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">SELECTED WORK</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Projects
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="group p-8 bg-background border border-border hover:border-foreground/20 transition-colors duration-500"
              >
                <div className="flex items-start space-x-4">
                  <span className="text-minimal text-muted-foreground font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-xl font-light text-architectural mb-3 group-hover:text-muted-foreground transition-colors duration-500">
                      {project.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
