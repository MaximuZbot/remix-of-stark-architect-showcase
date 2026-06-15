import Navigation from "@/components/Navigation";
import bgContact from "@/assets/bg-contact.png";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="relative pt-32 pb-32 overflow-hidden min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${bgContact})` }}
        />
        
        {/* Dark Overlay with blue tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-primary/20" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20">
              <div>
                <h1 className="text-minimal text-white/60 mb-4">GET IN TOUCH</h1>
                <h2 className="text-4xl md:text-6xl font-light text-white mb-12">
                  Let's Create Something
                  <br />
                  Extraordinary
                </h2>
                
                <div className="space-y-8">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-minimal text-white/60 mb-2">EMAIL</h3>
                    <a href="mailto:mohithkanna1@gmail.com" className="text-xl text-white hover:text-white/80 transition-colors duration-300">
                      mohithkanna1@gmail.com
                    </a>
                  </div>
                  
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-minimal text-white/60 mb-2">PHONE</h3>
                    <a href="tel:+1234567890" className="text-xl text-white hover:text-white/80 transition-colors duration-300">
                      +1 (234) 567-8900
                    </a>
                  </div>
                  
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-minimal text-white/60 mb-2">STUDIO</h3>
                    <address className="text-xl text-white not-italic">
                      123 Design Avenue
                      <br />
                      New York, NY 10001
                    </address>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8">
                  <h3 className="text-minimal text-white/60 mb-6">FOLLOW US</h3>
                  <div className="space-y-4">
                    <a href="#" className="block text-xl text-white hover:text-white/80 transition-colors duration-300">
                      Instagram
                    </a>
                    <a href="#" className="block text-xl text-white hover:text-white/80 transition-colors duration-300">
                      LinkedIn
                    </a>
                    <a href="#" className="block text-xl text-white hover:text-white/80 transition-colors duration-300">
                      Behance
                    </a>
                  </div>
                </div>
                
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8">
                  <p className="text-white/70 leading-relaxed">
                    We approach each project with curiosity, rigor, and a commitment to excellence. 
                    Our process begins with listening, understanding your vision, and translating 
                    it into spaces that exceed expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
