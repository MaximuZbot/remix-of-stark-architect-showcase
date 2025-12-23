import { Linkedin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">GET IN TOUCH</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                Let's Build
                <br />
                Something Together
              </h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">LOCATION</h4>
                  <address className="text-xl not-italic">
                    Kochi & Bangalore
                    <br />
                    India
                  </address>
                </div>
                
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">AVAILABILITY</h4>
                  <p className="text-xl">
                    Available for freelance, startups, and full-time roles
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">CONNECT</h4>
                <div className="space-y-4">
                  <a 
                    href="https://www.linkedin.com/in/mohithkanna" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-xl hover:text-muted-foreground transition-colors duration-300"
                  >
                    <Linkedin className="w-5 h-5 mr-3" />
                    LinkedIn
                  </a>
                </div>
              </div>
              
              <div className="pt-12 border-t border-border">
                <p className="text-muted-foreground">
                  I approach each project with a focus on speed, clarity, and production-ready delivery. 
                  Whether you need an AI system, a full-stack app, or automation tools—I build to ship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
