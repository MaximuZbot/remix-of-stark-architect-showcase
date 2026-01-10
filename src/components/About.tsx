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
                  I'm a Mechatronics Engineer turned solo AI and software builder.
                  I design and ship end-to-end systems—full-stack apps, automation pipelines, 
                  and computer vision tools that solve real operational problems.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I work solo, move fast, and focus on delivering production-ready systems.
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
                    <h5 className="text-lg font-medium mb-2">Solo & Fast</h5>
                    <p className="text-muted-foreground">Direct communication, rapid iteration, no overhead</p>
                  </div>
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">End-to-End Delivery</h5>
                    <p className="text-muted-foreground">From concept to production, handling every layer</p>
                  </div>
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">Production-Ready</h5>
                    <p className="text-muted-foreground">Systems built to run reliably in real environments</p>
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
