
import { motion } from 'framer-motion';
import { Star, MapPin, ChevronDown } from 'lucide-react';
import ThreeScene from './ThreeScene';

export default function Hero() {
  const handleScrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20"
    >
      {/* 3D background */}
      <ThreeScene />

      {/* Decorative overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 pointer-events-none" />

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Rating & Location Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-6"
        >
          <span className="flex items-center gap-1 bg-teal-500/10 backdrop-blur-md border border-teal-500/20 text-teal-300 text-xs md:text-sm px-3.5 py-1.5 rounded-full font-medium">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            4.2 / 5 Rated (180+ Reviews)
          </span>
          <span className="flex items-center gap-1 bg-accent/10 backdrop-blur-md border border-accent/20 text-accent text-xs md:text-sm px-3.5 py-1.5 rounded-full font-medium">
            <MapPin className="w-3.5 h-3.5" />
            Khammam, Telangana
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-warm-white tracking-tight leading-none mb-6 max-w-4xl"
        >
          Discover Contemporary <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-accent to-amber-500 font-serif">
            Boutique Elegance
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-xl text-warm-white/70 max-w-2xl mb-10 leading-relaxed font-sans"
        >
          Experience unmatched comfort and style at Sri Sri Sri Excellency. Nestled near Khammam’s bypass road, we combine modern amenities with heartwarming local hospitality.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => handleScrollTo('#booking')}
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-slate-950 px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-xl shadow-accent/20 hover:scale-[1.03] cursor-pointer"
          >
            Reserve Your Room
          </button>
          <button
            onClick={() => handleScrollTo('#rooms')}
            className="w-full sm:w-auto bg-slate-900/60 hover:bg-slate-900/80 text-warm-white border border-teal-500/20 hover:border-teal-500/40 backdrop-blur-md px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.03] cursor-pointer"
          >
            Explore Rooms
          </button>
        </motion.div>

        {/* Bottom Key Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="grid grid-cols-3 gap-6 sm:gap-12 mt-20 border-t border-teal-950/40 pt-8 w-full max-w-3xl"
        >
          <div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-accent">₹1,650+</p>
            <p className="text-xs sm:text-sm text-warm-white/50">Affordable Luxury</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-teal-400">100%</p>
            <p className="text-xs sm:text-sm text-warm-white/50">Air Conditioned</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-accent">24/7</p>
            <p className="text-xs sm:text-sm text-warm-white/50">Front Desk & Service</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer z-10 opacity-70 hover:opacity-100"
        onClick={() => handleScrollTo('#about')}
      >
        <span className="text-xs text-warm-white/50 tracking-widest font-sans font-medium uppercase">Scroll Down</span>
        <ChevronDown className="w-5 h-5 text-accent" />
      </motion.div>
    </section>
  );
}
