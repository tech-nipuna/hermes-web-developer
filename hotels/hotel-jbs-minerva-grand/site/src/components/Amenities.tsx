import { motion } from 'framer-motion'
import { Wifi, Car, Utensils, Coffee, Tv, Shield, Flower2, Users } from 'lucide-react'

const amenities = [
  { icon: Wifi, label: 'Free Wi-Fi', desc: 'High-speed internet throughout' },
  { icon: Car, label: 'Free Parking', desc: 'Private on-site parking' },
  { icon: Utensils, label: 'Restaurant', desc: 'Multi-cuisine dining' },
  { icon: Coffee, label: 'Coffee House', desc: '24/7 hot beverages' },
  { icon: Shield, label: '24/7 Security', desc: 'CCTV surveillance' },
  { icon: Tv, label: 'Flat Screen TV', desc: 'Cable channels in room' },
  { icon: Users, label: 'Conference Hall', desc: 'Banquet & events space' },
  { icon: Flower2, label: 'Garden', desc: 'Landscaped outdoor area' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
}

export default function Amenities() {
  return (
    <section id="amenities" className="py-24 bg-brand/5">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-5xl font-heading text-brand mb-4">Amenities</h2>
          <p className="text-gray-600 text-lg">Everything you need for a comfortable stay</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((a, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center group">
              <div className="w-14 h-14 rounded-xl bg-amber/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-amber group-hover:text-white transition-all">
                <a.icon size={28} className="text-amber group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-brand mb-1">{a.label}</h3>
              <p className="text-gray-500 text-sm">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
