import { useState } from "react";
import { Linkedin, Send, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import RobotEyes from "@/components/RobotEyes";
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
    
    try {
      const response = await fetch("https://formspree.io/mohithkanna1@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message
        })
      });
      
      if (response.ok) {
        toast({
          title: "TRANSMISSION SUCCESSFUL",
          description: "Your message has been routed directly to Mohith's inbox.",
        });
        reset();
      } else {
        throw new Error("Formspree response not OK");
      }
    } catch (error) {
      console.error("Formspree failed, falling back to mailto client redirection:", error);
      
      // Fallback: construct mailto link
      const subject = encodeURIComponent(data.subject);
      const body = encodeURIComponent(`Hello Mohith,\n\n${data.message}\n\n---\nSender: ${data.name}\nContact: ${data.email}`);
      const mailtoUrl = `mailto:mohithkanna1@gmail.com?subject=${subject}&body=${body}`;
      
      toast({
        title: "SYSTEM REDIRECT",
        description: "Background route failed. Launching local mail client...",
      });
      
      window.location.href = mailtoUrl;
      reset();
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column */}
            <div 
              ref={leftRef}
              className={`transition-all duration-700 ${
                leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="text-minimal text-white/60 mb-4">GET IN TOUCH</h2>
              <h3 className="text-4xl md:text-6xl font-light text-white mb-12">
                Let's Build
                <br />
                Something Together
              </h3>
              
              <div className="space-y-6">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                  <h4 className="text-minimal text-white/60 mb-2">DIRECT EMAIL</h4>
                  <a
                    href="mailto:mohithkanna1@gmail.com"
                    className="text-xl text-white hover:text-white/80 transition-colors duration-300 flex items-center gap-3"
                  >
                    <Mail className="w-5 h-5 text-white/60" />
                    mohithkanna1@gmail.com
                  </a>
                </div>

                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                  <h4 className="text-minimal text-white/60 mb-2">LOCATION</h4>
                  <address className="text-xl text-white not-italic">
                    Kochi & Bangalore, India
                  </address>
                </div>
                
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                  <h4 className="text-minimal text-white/60 mb-2">AVAILABILITY</h4>
                  <p className="text-lg text-white">
                    Available for freelance, startups, and full-time roles
                  </p>
                  <a
                    href="https://www.linkedin.com/in/mohithkanna"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-base text-white hover:text-white/80 transition-colors duration-300"
                  >
                    <Linkedin className="w-5 h-5 mr-2 text-cyan-400" />
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Robot Companion */}
              <div className="mt-12 flex items-center gap-6">
                <RobotEyes className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 shrink-0" />
                <a
                  href="#message-form"
                  className="md:hidden flex-1 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4 transition-colors hover:bg-white/10"
                >
                  <h4 className="text-minimal text-white/60 mb-1">TALK TO ROBOT</h4>
                  <p className="text-sm text-white font-medium leading-snug">
                    Initialize terminal session below
                    <span aria-hidden className="ml-1">&darr;</span>
                  </p>
                </a>
              </div>
            </div>

            {/* Right Column: Terminal Console Form */}
            <div 
              ref={rightRef}
              className={`transition-all duration-700 delay-200 flex justify-end items-start ${
                rightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="w-full">
                <div 
                  id="message-form" 
                  className="scroll-mt-24 w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 font-mono relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/20 transition-all duration-300"
                >
                  {/* Scanline effect overlay */}
                  <div 
                    className="pointer-events-none absolute inset-0 opacity-2"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.05) 50%)",
                      backgroundSize: "100% 4px"
                    }}
                  />
                  
                  {/* Terminal Header Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20 block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20 block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20 block" />
                    </div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">
                      session: talk_to_robot.sh
                    </span>
                    <div className="w-8" />
                  </div>

                  {/* Status Prompt */}
                  <div className="text-white/60 text-xs mb-6 space-y-1 select-none leading-relaxed">
                    <p><span className="text-white/40">guest@mohithkanna:~$</span> <span className="text-white/80">./talk_to_robot.sh</span></p>
                    <p className="text-white/30">&gt;&gt; Connecting to target: mohithkanna1@gmail.com</p>
                    <p className="text-white/50">&gt;&gt; Status: SECURE_TUNNEL_ESTABLISHED // ONLINE</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Inputs */}
                    <div className="space-y-2">
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                        [01] SELECT SENDER NAME:
                      </label>
                      <div className="flex items-center gap-2 border-b border-white/10 py-2 focus-within:border-white/40 transition-colors">
                        <span className="text-white/30 text-sm select-none">&gt;&nbsp;$</span>
                        <input
                          type="text"
                          placeholder="your name"
                          {...register("name")}
                          className="w-full bg-transparent text-white outline-none border-none text-sm placeholder:text-white/15 font-mono focus:ring-0 p-0"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-red-400/70 mt-1 font-mono">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                        [02] SPECIFY RETURN PATH / EMAIL:
                      </label>
                      <div className="flex items-center gap-2 border-b border-white/10 py-2 focus-within:border-white/40 transition-colors">
                        <span className="text-white/30 text-sm select-none">&gt;&nbsp;$</span>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          {...register("email")}
                          className="w-full bg-transparent text-white outline-none border-none text-sm placeholder:text-white/15 font-mono focus:ring-0 p-0"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-400/70 mt-1 font-mono">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                        [03] DEFINE TASK SUBJECT:
                      </label>
                      <div className="flex items-center gap-2 border-b border-white/10 py-2 focus-within:border-white/40 transition-colors">
                        <span className="text-white/30 text-sm select-none">&gt;&nbsp;$</span>
                        <input
                          type="text"
                          placeholder="project type / consultation"
                          {...register("subject")}
                          className="w-full bg-transparent text-white outline-none border-none text-sm placeholder:text-white/15 font-mono focus:ring-0 p-0"
                        />
                      </div>
                      {errors.subject && (
                        <p className="text-xs text-red-400/70 mt-1 font-mono">{errors.subject.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                        [04] TRANSMIT DETAILED PACKET / MESSAGE:
                      </label>
                      <div className="flex items-start gap-2 border-b border-white/10 py-2 focus-within:border-white/40 transition-colors">
                        <span className="text-white/30 text-sm mt-0.5 select-none">&gt;&nbsp;$</span>
                        <textarea
                          placeholder="describe the system specifications or project vision..."
                          rows={4}
                          {...register("message")}
                          className="w-full bg-transparent text-white outline-none border-none text-sm placeholder:text-white/15 font-mono resize-none focus:ring-0 p-0"
                        />
                      </div>
                      {errors.message && (
                        <p className="text-xs text-red-400/70 mt-1 font-mono">{errors.message.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] text-white font-mono transition-all duration-300 disabled:opacity-50 rounded-md"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white/60" />
                          <span>EXECUTING CMD...</span>
                        </>
                      ) : (
                        <>
                          <span>RUN: TRANSMIT_MESSAGE</span>
                          <Send className="w-4 h-4 text-white/60" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
                
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6 mt-6">
                  <p className="text-white/70 text-sm leading-relaxed">
                    I approach each project with a focus on speed, clarity, and production-ready delivery. 
                    Whether you need an AI system, a full-stack app, or automation tools—I build to ship.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
