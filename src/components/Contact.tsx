import { useState } from "react";
import { Linkedin, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import bgContact from "@/assets/bg-contact.png";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate submission - replace with actual API call when backend is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message received!",
      description: "Email integration coming soon. For now, reach out via LinkedIn.",
    });
    
    reset();
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgContact})` }}
      />
      
      {/* Dark Overlay with blue tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-primary/10" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-20">
            <div 
              ref={leftRef}
              className={`transition-all duration-700 ${
                leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="text-minimal text-white/60 mb-4">GET IN TOUCH</h2>
              <h3 className="text-6xl font-light text-white mb-12">
                Let's Build
                <br />
                Something Together
              </h3>
              
              <div className="space-y-8">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                  <h4 className="text-minimal text-white/60 mb-2">LOCATION</h4>
                  <address className="text-xl text-white not-italic">
                    Kochi & Bangalore
                    <br />
                    India
                  </address>
                </div>
                
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                  <h4 className="text-minimal text-white/60 mb-2">AVAILABILITY</h4>
                  <p className="text-xl text-white">
                    Available for freelance, startups, and full-time roles
                  </p>
                </div>

                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                  <h4 className="text-minimal text-white/60 mb-4">CONNECT</h4>
                  <a 
                    href="https://www.linkedin.com/in/mohithkanna" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-xl text-white hover:text-white/80 transition-colors duration-300"
                  >
                    <Linkedin className="w-5 h-5 mr-3" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
            
            <div 
              ref={rightRef}
              className={`transition-all duration-700 delay-200 ${
                rightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-8">
                <h4 className="text-minimal text-white/60 mb-6">SEND A MESSAGE</h4>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      {...register("name")}
                      className="w-full px-0 py-4 bg-transparent border-b border-white/20 focus:border-white text-white outline-none transition-colors placeholder:text-white/40"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      {...register("email")}
                      className="w-full px-0 py-4 bg-transparent border-b border-white/20 focus:border-white text-white outline-none transition-colors placeholder:text-white/40"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Subject"
                      {...register("subject")}
                      className="w-full px-0 py-4 bg-transparent border-b border-white/20 focus:border-white text-white outline-none transition-colors placeholder:text-white/40"
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-400 mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      {...register("message")}
                      className="w-full px-0 py-4 bg-transparent border-b border-white/20 focus:border-white text-white outline-none transition-colors resize-none placeholder:text-white/40"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-8 py-4 border border-white bg-white text-background hover:bg-transparent hover:text-white transition-colors duration-300 disabled:opacity-50 rounded-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6 mt-8">
                <p className="text-white/70">
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
