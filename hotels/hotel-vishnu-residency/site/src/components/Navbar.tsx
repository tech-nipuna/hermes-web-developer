import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#booking' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand/95 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="text-2xl font-heading text-accent tracking-wide">Hotel Vishnu Residency</a>
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="text-cream/90 hover:text-accent transition-colors text-sm uppercase tracking-wider">{l.label}</a>
          ))}
          <a href="tel:+918712223344" className="bg-accent text-brand px-5 py-2 rounded-full font-semibold hover:bg-brand/5 transition-colors flex items-center gap-2 text-sm">
            <Phone size={14} /> Book Now
          </a>
        </div>
        <button className="md:hidden text-cream" onClick={() => setOpen(!open)}>{open ? <X size={28} /> : <Menu size={28} />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="md:hidden bg-brand overflow-hidden">
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-cream hover:text-accent">{l.label}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
