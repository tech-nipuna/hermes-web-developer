import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Booking() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [room, setRoom] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="booking" className="py-24 bg-brand">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-5xl font-heading text-accent mb-4">Book Your Stay</h2>
          <p className="text-cream/80 mb-12 text-lg">Reserve your room today and experience luxury redefined</p>
        </motion.div>
        {sent ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-brand/5 rounded-2xl p-12">
            <p className="text-3xl font-heading text-brand">Thank You!</p>
            <p className="text-gray-600 mt-3">We'll confirm your booking shortly via email.</p>
          </motion.div>
        ) : (
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="bg-brand/5/10 backdrop-blur-sm rounded-3xl p-8 grid md:grid-cols-2 gap-5 text-left">
            <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)}
              className="px-5 py-3 rounded-xl bg-brand/5/20 border border-ivory/30 text-cream placeholder:text60 focus:outline-none focus:border-accent" />
            <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)}
              className="px-5 py-3 rounded-xl bg-brand/5/20 border border-ivory/30 text-cream placeholder:text-cream/60 focus:outline-none focus:border-accent" />
            <input type="date" required value={checkin} onChange={e => setCheckin(e.target.value)}
              className="px-5 py-3 rounded-xl bg-brand/5/20 border border-ivory/30 text-cream focus:outline-none focus:border-accent" />
            <input type="date" required value={checkout} onChange={e => setCheckout(e.target.value)}
              className="px-5 py-3 rounded-xl bg-brand/5/20 border border-ivory/30 text-cream focus:outline-none focus:border-accent" />
            <select required value={room} onChange={e => setRoom(e.target.value)}
              className="px-5 py-3 rounded-xl bg-brand/5/20 border border-ivory/30 text-cream md:col-span-2 focus:outline-none focus:border-accent">
              <option value="" className="text-gray-900">Select Room</option>
              <option value="single" className="text-gray-900">Luxury Single - rs.1,500</option>
              <option value="king" className="text-gray-900">Deluxe King Room - rs.2,500</option>
              <option value="exec" className="text-gray-900">Executive Room - rs.2,500</option>
              <option value="suite" className="text-gray-900">Suite Room - rs.2,500</option>
            </select>
            <button type="submit" className="md:col-span-2 bg-accent text-brand py-4 rounded-xl font-bold text-lg hover:bg-brand/5 transition-colors">
              Confirm Booking
            </button>
          </motion.form>
        )}
      </div>
    </section>
  )
}
