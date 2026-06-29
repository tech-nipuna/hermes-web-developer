import { motion } from 'framer-motion';
import { ShieldCheck, Award, ThumbsUp } from 'lucide-react';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as any } }
  };

  return (
    <section id="about" className="py-24 bg-slate-950 text-warm-white relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
        >
          {/* Images Montage Section */}
          <div className="lg:col-span-6 relative h-[450px] sm:h-[550px] flex items-center justify-center">
            {/* Main Image */}
            <motion.div
              variants={itemVariants}
              className="absolute w-4/5 h-[350px] sm:h-[420px] left-0 top-0 overflow-hidden rounded-2xl border border-teal-500/20 shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                alt="Sri Sri Sri Excellency Facade"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            {/* Overlapping Secondary Image */}
            <motion.div
              variants={itemVariants}
              className="absolute w-2/3 h-[220px] sm:h-[280px] right-0 bottom-4 overflow-hidden rounded-2xl border-4 border-slate-950 shadow-2xl z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
                alt="Cozy Lounge and Reception"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            {/* Accent badge */}
            <motion.div
              variants={itemVariants}
              className="absolute bottom-1/3 left-6 sm:left-12 z-20 bg-gradient-to-br from-accent to-amber-600 text-slate-950 p-6 rounded-2xl shadow-xl max-w-[160px] text-center"
            >
              <p className="text-4xl font-serif font-black leading-none">4.2★</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-1 text-slate-950/80">Google Rating</p>
            </motion.div>
          </div>

          {/* Text Content Section */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.span
              variants={itemVariants}
              className="text-accent uppercase tracking-widest font-semibold text-sm mb-3"
            >
              Welcome to Sri Sri Sri Excellency
            </motion.span>
            
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-warm-white mb-6 leading-tight"
            >
              Boutique Comfort <br />in Khammam
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-warm-white/70 text-base sm:text-lg mb-6 leading-relaxed font-sans"
            >
              Located prominently in the Usha Hari Convention Building on Bypass Road, beside the Railway Over Bridge in Raparthi Nagar, Sri Sri Sri Excellency stands out as a prime destination for corporate, leisure, and convention travelers.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-warm-white/70 text-base sm:text-lg mb-8 leading-relaxed font-sans"
            >
              We provide clean, comfortable, and modern accommodation with state-of-the-art facilities. Our dedicated team is committed to delivering exceptional 24-hour service to ensure your stay is flawless.
            </motion.p>

            {/* Mini Features List */}
            <div className="space-y-4">
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-warm-white">Sparkling Clean Rooms</h3>
                  <p className="text-sm text-warm-white/50">Daily sanitization, premium linens, and clean modern bathrooms.</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-warm-white">Polite & Attentive Staff</h3>
                  <p className="text-sm text-warm-white/50">Highly rated, courteous hospitality team ready to help at any time.</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-warm-white">Convenient Bypass Access</h3>
                  <p className="text-sm text-warm-white/50">Strategically placed, avoiding heavy traffic while keeping the city reachable.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
