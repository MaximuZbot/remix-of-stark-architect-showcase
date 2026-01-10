import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import About from "@/components/About";
import ProjectsPreview from "@/components/ProjectsPreview";
import CurrentlyBuilding from "@/components/CurrentlyBuilding";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ProjectsPreview />
      <Capabilities />
      <About />
      <CurrentlyBuilding />
      <TechStack />
      <Contact />
    </div>
  );
};

export default Index;
