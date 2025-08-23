import "./App.css";
import { Navigation } from "@/components/layout/Navigation";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { NAVIGATION_ITEMS } from "@/utils/constants";
import { 
  Hero, 
  About, 
  Approach, 
  Lessons, 
  Community, 
  Contact 
} from "@/components/sections";

function App() {
  const sectionIds = NAVIGATION_ITEMS.map((item) => item.id);
  const activeSection = useScrollSpy(sectionIds);

  return (
    <div className="min-h-screen bg-white">
      <Navigation activeSection={activeSection} />
      
      <main className="pt-16">
        <Hero />
        <About />
        <Approach />
        <Lessons />
        <Community />
        <Contact />
      </main>
    </div>
  );
}

export default App;