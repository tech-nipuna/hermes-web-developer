
import {
  Wifi,
  Car,
  Coffee,
  Wind,
  Utensils,
  Sparkles,
  Award,
  ArrowUpDown,
  Shirt,
  Clock
} from 'lucide-react';
import { motion as framerMotion } from 'framer-motion';

// Wait, we imported motion twice: once standard react? No, motion is from framer-motion.
// Let's clean up imports.

interface Amenity {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function Amenities() {
  const amenities: Amenity[] = [
    {
      name: 'Complimentary Breakfast',
      description: 'Start your morning with a selection of hot breakfast options.',
      icon: Coffee
    },
    {
      name: 'Free High-Speed Wi-Fi',
      description: 'Stay connected seamlessly throughout the property.',
      icon: Wifi
    },
    {
      name: '100% Air Conditioned',
      description: 'Independently controlled climate systems in all rooms.',
      icon: Wind
    },
    {
      name: '24/7 Room Service',
      description: 'Delicious hot meals delivered straight to your door at any hour.',
      icon: Utensils
    },
    {
      name: 'Daily Housekeeping',
      description: 'Impeccable cleanliness maintained by our attentive team.',
      icon: Sparkles
    },
    {
      name: 'Banquet & Events',
      description: 'Host premium gatherings in our convention facilities.',
      icon: Award
    },
    {
      name: 'Elevator Access',
      description: 'Fully automated multi-floor lift for total convenience.',
      icon: ArrowUpDown
    },
    {
      name: 'Laundry & Dry Cleaning',
      description: 'Same-day clothing care services available upon request.',
      icon: Shirt
    },
    {
      name: '24-Hour Front Desk',
      description: 'Round-the-clock check-in, check-out, and traveler support.',
      icon: Clock
    },
    {
      name: 'Complimentary Parking',
      description: 'Secure, on-site parking for all our registered guests.',
      icon: Car
    }
  ];

  return (
    <section id="amenities" className="py-24 bg-slate-950 text-warm-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <framerMotion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent uppercase tracking-widest font-semibold text-sm"
          >
            Thoughtful Details
          </framerMotion.span>
          <framerMotion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mt-2"
          >
            Hotel Amenities
          </framerMotion.h2>
          <framerMotion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-teal-500 to-accent mx-auto mt-4 rounded-full"
          />
          <framerMotion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-warm-white/60 mt-4 font-sans"
          >
            Everything you need for a restful, convenient, and seamless stay in Raparthi Nagar, Khammam.
          </framerMotion.p>
        </div>

        {/* Grid with Blur-In Effect */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {amenities.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <framerMotion.div
                key={idx}
                initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: 'easeOut' as const }}
                className="bg-slate-900/40 border border-teal-950/20 rounded-2xl p-6 hover:border-teal-500/30 hover:bg-slate-900/60 transition-all duration-300 flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-300 mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-serif font-bold text-warm-white mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-warm-white/40 leading-relaxed font-sans">
                  {item.description}
                </p>
              </framerMotion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
