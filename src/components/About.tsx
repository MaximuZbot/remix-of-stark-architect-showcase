import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const About = () => {
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-32 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div 
              ref={leftRef}
              className={`transition-all duration-700 ${
                leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="text-minimal text-muted-foreground mb-4">ABOUT</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                Builder Profile
              </h3>
              
              <div className="space-y-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  My background in <strong>Mechatronics Engineering</strong>—the intersection of mechanical systems, electronics, and software—shapes my approach to development. I treat software architectures like physical machines: highly integrated, efficiency-driven, and designed for operational resilience.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  As a <strong>Solo Product Builder</strong>, I operate under a single, tight loop. By writing the UI, designing the database schema, building serverless automation pipelines, and training custom AI models myself, I eliminate communication overhead and deliver fully integrated systems with speed.
                </p>
              </div>
            </div>
            
            <div 
              ref={rightRef}
              className={`space-y-12 transition-all duration-700 delay-200 ${
                rightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">WORK PRINCIPLES</h4>
                <div className="space-y-6">
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">Systems Integration</h5>
                    <p className="text-muted-foreground">Fusing mechanics-level precision with cloud-native scalability. Every endpoint, cron job, and DB query works in concert.</p>
                  </div>
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">Full-Loop Execution</h5>
                    <p className="text-muted-foreground">Handling client interviews, UI design, database structures, security, and machine learning deployments concurrently.</p>
                  </div>
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">Zero-Bloat Engineering</h5>
                    <p className="text-muted-foreground">Rejecting over-engineered patterns. Focusing purely on performance, runtime stability, and clean, readable codebases.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-border">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-minimal text-muted-foreground mb-2">LOCATION</h4>
                    <p className="text-xl">Kochi & Bangalore</p>
                  </div>
                  <div>
                    <h4 className="text-minimal text-muted-foreground mb-2">BACKGROUND</h4>
                    <p className="text-xl">Mechatronics Engineer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
