import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Location() {
  return (
    <section id="location" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-5xl font-heading text-maroon mb-4">Find Us</h2>
          <p className="text-gray-600 text-lg">Conveniently located on Wyra Road, in the heart of Khammam</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-lg h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.123!2d80.143!3d17.2536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTcwrDE1JzE1LjAiTiA4MMKwMDgnMzQuOCJF!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
            <div className="flex gap-4 items-start">
              <MapPin className="text-gold shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-maroon">Address</h4>
                <p className="text-gray-600 text-sm">H.No: 15-9-543/1, Wyra Road, Khammam, Telangana 507001</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Phone className="text-gold shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-maroon">Phone</h4>
                <p className="text-gray-600 text-sm">+91 8712 22 33 44</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Mail className="text-gold shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-maroon">Email</h4>
                <p className="text-gray-600 text-sm">info@grandgayathri.com</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Clock className="text-gold shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-maroon">Front Desk</h4>
                <p className="text-gray-600 text-sm">24 hours / 7 days a week</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
