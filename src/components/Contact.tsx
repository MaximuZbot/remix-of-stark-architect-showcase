import { useState } from "react";
import { Linkedin, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
    <section id="contact" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div 
              ref={leftRef}
              className={`transition-all duration-700 ${
                leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
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

                <div>
                  <h4 className="text-minimal text-muted-foreground mb-6">CONNECT</h4>
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
            </div>
            
            <div 
              ref={rightRef}
              className={`transition-all duration-700 delay-200 ${
                rightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h4 className="text-minimal text-muted-foreground mb-6">SEND A MESSAGE</h4>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    {...register("name")}
                    className="w-full px-0 py-4 bg-transparent border-b border-border focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/50"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    {...register("email")}
                    className="w-full px-0 py-4 bg-transparent border-b border-border focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/50"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="Subject"
                    {...register("subject")}
                    className="w-full px-0 py-4 bg-transparent border-b border-border focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/50"
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    {...register("message")}
                    className="w-full px-0 py-4 bg-transparent border-b border-border focus:border-foreground outline-none transition-colors resize-none placeholder:text-muted-foreground/50"
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-8 py-4 border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground transition-colors duration-300 disabled:opacity-50"
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
              
              <div className="pt-12 mt-12 border-t border-border">
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
