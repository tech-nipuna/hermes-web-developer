import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } }
}

export default function About() {
  const stats = [
    { num: '4.1', label: 'Google Rating', desc: 'Based on 3,309 guest reviews' },
    { num: 'rs.4,300', label: 'Starting Rate', desc: 'Per night, excluding taxes' },
    { num: '3,309', label: 'Happy Guests', desc: 'Reviewed on Google Maps' },
  ]
  return (
    <section id="about" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-5xl font-heading text-maroon mb-6">About Our Hotel</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nestled on prestigious Wyra Road, Hotel Grand Gayathri stands as a beacon of luxury in the heart of Khammam, Telangana.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <p className="text-4xl font-bold text-gold">{s.num}</p>
              <p className="text-lg font-semibold text-maroon mt-2">{s.label}</p>
              <p className="text-gray-500 mt-1 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
