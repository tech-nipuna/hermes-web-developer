import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const reviews = [
  { name: 'Rajesh K.', rating: 5, text: 'Excellent hotel on Wyra road. Staff is professional and courteous. Highly recommended for families.', date: '2025-12-10' },
  { name: 'Priya M.', rating: 5, text: 'The in-house restaurant serves some of the best food in Khammam. Clean rooms, ample parking space.', date: '2025-11-28' },
  { name: 'Suresh V.', rating: 4, text: 'Good location, good service. The banquet hall is well maintained for events and gatherings.', date: '2025-11-15' },
  { name: 'Anita S.', rating: 5, text: 'Loved the coffee house and BBQ facilities. Professional staff always ready to help.', date: '2025-10-30' },
]

export default function Reviews() {
  const [idx, setIdx] = useState(0)
  const next = () => setIdx((i) => (i + 1) % reviews.length)
  const prev = () => setIdx((i) => (i - 1 + reviews.length) % reviews.length)

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-5xl font-heading text-brand mb-4">Guest Reviews</motion.h2>
        <p className="text-gray-600 mb-12">What our guests say about us</p>
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }} className="bg-brand/5 rounded-3xl p-10 shadow-sm">
            <Quote size={36} className="text-accent mx-auto mb-4" />
            <p className="text-lg text-gray-700 italic mb-6">"{reviews[idx].text}"</p>
            <div className="flex gap-1 justify-center mb-2">
              {Array.from({ length: reviews[idx].rating }).map((_, i) => (
                <Star key={i} size={18} className="text-accent fill-gold" />
              ))}
            </div>
            <p className="font-semibold text-brand">{reviews[idx].name}</p>
            <p className="text-gray-400 text-sm">{reviews[idx].date}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={prev} className="w-12 h-12 rounded-full bg-brand text-cream flex items-center justify-center hover:bg-accent hover:text-brand transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="w-12 h-12 rounded-full bg-brand text-cream flex items-center justify-center hover:bg-accent hover:text-brand transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
