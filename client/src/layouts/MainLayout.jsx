import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Ambient dungeon atmosphere — decorative only, kept out of the layout flow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute -top-24 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-glow-purple/10 blur-3xl animate-float" />
        <div
          className="absolute top-1/3 -right-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-glow-cyan/10 blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-glow-gold/5 blur-3xl animate-float"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">{children}</main>
      <Footer />
    </div>
  );
}
