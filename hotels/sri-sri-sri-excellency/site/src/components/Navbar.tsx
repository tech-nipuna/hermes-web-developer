import React, { useState, useEffect } from 'react';
import { Menu, X, Hotel } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Rooms & Rates', href: '#rooms' },
    { name: 'Amenities', href: '#amenities' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Location', href: '#location' }
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-teal-950/30 py-3 shadow-lg shadow-teal-950/5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-600 rounded-lg text-white">
              <Hotel className="w-6 h-6 text-warm-white" />
            </div>
            <div>
              <span className="font-serif text-lg md:text-xl font-bold tracking-wide text-warm-white flex flex-col md:flex-row md:gap-1.5 leading-none">
                <span>Sri Sri Sri</span>
                <span className="text-accent font-sans text-sm md:text-base font-medium self-start md:self-end">EXCELLENCY</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-warm-white/80 hover:text-accent font-medium text-sm transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#booking"
              onClick={(e) => handleScrollTo(e, '#booking')}
              className="bg-accent hover:bg-accent/90 text-slate-950 px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg shadow-accent/20 hover:scale-[1.02]"
            >
              Book Now
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-warm-white/80 hover:text-warm-white p-2"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-slate-950/95 border-b border-teal-950/30 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="block text-warm-white/80 hover:text-accent py-2 text-base font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#booking"
                onClick={(e) => handleScrollTo(e, '#booking')}
                className="block text-center bg-accent hover:bg-accent/90 text-slate-950 py-3 rounded-lg font-semibold text-base transition-colors shadow-lg shadow-accent/15"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
