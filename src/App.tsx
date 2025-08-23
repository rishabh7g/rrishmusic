import "./App.css";
import { Navigation } from "@/components/layout/Navigation";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { NAVIGATION_ITEMS } from "@/utils/constants";

function App() {
  const sectionIds = NAVIGATION_ITEMS.map((item) => item.id);
  const activeSection = useScrollSpy(sectionIds);

  return (
    <div className="min-h-screen bg-white">
      <Navigation activeSection={activeSection} />

      <main className="pt-16">
        {" "}
        {/* Account for fixed navigation */}
        <section
          id="hero"
          className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white"
        >
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Hi, I'm Rrish.
            </h1>

            <p className="text-lg md:text-xl font-body mb-6 max-w-3xl mx-auto leading-relaxed">
              I'm a musician who improvises on blues and different music genres.
              I help people learn music at every level and improve their
              improvisation skills.
            </p>

            <p className="text-lg font-body">
              Find me on Instagram:{" "}
              <a
                href="https://instagram.com/rrishmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-yellow-accent hover:text-white transition-colors duration-300 font-medium underline 
  decoration-2 underline-offset-2"
              >
                @rrishmusic
              </a>
            </p>
          </div>
        </section>
        {/* Placeholder sections for testing navigation */}
        <section id="about" className="section bg-white">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-heading font-bold text-neutral-charcoal">
              About
            </h2>
            <p className="text-lg text-neutral-charcoal mt-4">
              About section coming soon...
            </p>
          </div>
        </section>
        <section id="approach" className="section bg-neutral-gray-light">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-heading font-bold text-neutral-charcoal">
              Approach
            </h2>
            <p className="text-lg text-neutral-charcoal mt-4">
              Teaching approach section coming soon...
            </p>
          </div>
        </section>
        <section id="lessons" className="section bg-white">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-heading font-bold text-neutral-charcoal">
              Lessons
            </h2>
            <p className="text-lg text-neutral-charcoal mt-4">
              Lessons section coming soon...
            </p>
          </div>
        </section>
        <section id="community" className="section bg-neutral-gray-light">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-heading font-bold text-neutral-charcoal">
              Community
            </h2>
            <p className="text-lg text-neutral-charcoal mt-4">
              Community section coming soon...
            </p>
          </div>
        </section>
        <section
          id="contact"
          className="section bg-brand-blue-primary text-white"
        >
          <div className="container-custom text-center">
            <h2 className="text-4xl font-heading font-bold">Contact</h2>
            <p className="text-lg mt-4">Contact section coming soon...</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
