const Capabilities = () => {
  const capabilities = [
    {
      number: "01",
      title: "AI, COMPUTER VISION & AUTOMATION",
      items: [
        "Custom YOLOv8 models",
        "Object detection and visual analytics",
        "OCR and screenshot-to-data pipelines"
      ]
    },
    {
      number: "02", 
      title: "FULL-STACK APP DEVELOPMENT",
      items: [
        "Web apps and internal tools",
        "Firebase Auth and Firestore",
        "Role-based dashboards and CRMs"
      ]
    },
    {
      number: "03",
      title: "SYSTEMS & WORKFLOW DESIGN",
      items: [
        "Business process automation",
        "Internal tools for teams",
        "Automation-first system architecture"
      ]
    }
  ];

  return (
    <section id="capabilities" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">CAPABILITIES</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              What I Build
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-x-16 gap-y-16">
            {capabilities.map((capability, index) => (
              <div key={index} className="group">
                <div className="flex flex-col">
                  <span className="text-minimal text-muted-foreground font-medium mb-4">
                    {capability.number}
                  </span>
                  <h4 className="text-xl font-light mb-6 text-architectural group-hover:text-muted-foreground transition-colors duration-500">
                    {capability.title}
                  </h4>
                  <ul className="space-y-3">
                    {capability.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-muted-foreground leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
