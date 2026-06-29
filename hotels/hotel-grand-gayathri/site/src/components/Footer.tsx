import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-maroon border-t border-gold/30 py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-ivory/80">
        <div>
          <h3 className="text-2xl font-heading text-gold mb-4">Hotel Grand Gayathri</h3>
          <p className="text-sm">Luxury and heritage in the heart of Khammam, Telangana. A proud legacy of hospitality since decades.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gold mb-4">Contact</h4>
          <div className="space-y-3 text-sm">
            <p className="flex gap-3 items-start"><MapPin size={16} className="mt-0.5 shrink-0" /> Wyra Road, Khammam, Telangana 507001</p>
            <p className="flex gap-3"><Phone size={16} /> +91 8712 22 33 44</p>
            <p className="flex gap-3"><Mail size={16} /> info@grandgayathri.com</p>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gold mb-4">Quick Links</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <a href="#rooms" className="hover:text-gold">Rooms</a>
            <a href="#amenities" className="hover:text-gold">Amenities</a>
            <a href="#reviews" className="hover:text-gold">Reviews</a>
            <a href="#location" className="hover:text-gold">Location</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-ivory/20 text-center text-sm text-ivory/60">
        © 2026 Hotel Grand Gayathri. All rights reserved.
      </div>
    </footer>
  )
}
