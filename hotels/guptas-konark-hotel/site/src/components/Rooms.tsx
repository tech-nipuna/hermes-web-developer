import { motion } from 'framer-motion'


const rooms = [
  { name: 'Luxury Single', price: 'rs.1,930', size: '280 sqft', occupancy: '1 Guest', image: 'https://images.unsplash.com/photo-1590490360182-c33d655d4d43?w=800&q=80', amenities: ['King Bed', 'AC', 'TV', 'Wi-Fi', 'Mini Bar'] },
  { name: 'Deluxe King Room', price: 'rs.2,500', size: '350 sqft', occupancy: '2 Guests', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80', amenities: ['King Bed', 'AC', 'TV', 'Wi-Fi', 'Mini Bar'] },
  { name: 'Executive Room', price: 'rs.2,500', size: '420 sqft', occupancy: '2 Guests', image: 'https://images.unsplash.com/photo-1631049307264-da70304?w=800&q=80', amenities: ['King Bed', 'AC', 'TV', 'Wi-Fi', 'Work Desk'] },
  { name: 'Suite Room', price: 'rs.2,500', size: '550 sqft', occupancy: '3 Guests', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80', amenities: ['King Bed', 'Living Area', 'AC', 'TV', 'Bathtub'] },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
}

export default function Rooms() {
  return (
    <section id="rooms" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-5xl font-heading text-brand mb-4">Rooms & Suites</h2>
          <p className="text-gray-600 text-lg">Thoughtfully crafted spaces for every traveler</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((r, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} className="bg-brand/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group">
              <div className="h-48 overflow-hidden relative">
                <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-brand text-cream px-3 py-1 rounded-full text-sm font-semibold">{r.price}</div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-heading text-brand mb-2">{r.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{r.size} | {r.occupancy}</p>
                <div className="flex flex-wrap gap-2">
                  {r.amenities.map(a => (
                    <span key={a} className="bg-accent/10 text-brand text-xs px-2 py-1 rounded">{a}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
