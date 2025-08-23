import "./App.css";

function App() {
  return (
    <main className="min-h-screen bg-white">
      <section className="hero section">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-neutral-charcoal mb-6">
            Hi, I'm Rrish.
          </h1>

          <p className="text-lg md:text-xl font-body text-neutral-charcoal mb-6 max-w-3xl mx-auto leading-relaxed">
            I'm a musician who improvises on blues and different music genres. I
            help people learn music at every level and improve their
            improvisation skills.
          </p>

          <p className="text-lg font-body text-neutral-charcoal">
            Find me on Instagram:{" "}
            <a
              href="https://instagram.com/rrishmusic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue-primary hover:text-brand-blue-secondary transition-colors duration-300 font-medium 
  underline decoration-2 underline-offset-2"
            >
              @rrishmusic
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
