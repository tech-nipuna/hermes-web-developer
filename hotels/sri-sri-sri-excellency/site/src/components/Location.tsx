
import { MapPin, Phone, Mail, Navigation, Train, Map, Shield } from 'lucide-react';

export default function Location() {
  const nearbyPlaces = [
    { name: 'Khammam Railway Station', distance: '1.8 km (approx 6 mins drive)', icon: Train },
    { name: 'Lakaram Lake & Lake View Park', distance: '3.2 km (approx 8 mins drive)', icon: Map },
    { name: 'Khammam Fort', distance: '4.5 km (approx 12 mins drive)', icon: Navigation },
    { name: 'Raparthi Nagar Railway Over Bridge', distance: 'Beside the hotel (1 min walk)', icon: Shield }
  ];

  return (
    <section id="location" className="py-24 bg-slate-950 text-warm-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent uppercase tracking-widest font-semibold text-sm">
            Getting Here
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mt-2">
            Location & Directions
          </h2>
          <div className="h-1 bg-gradient-to-r from-teal-500 to-accent mx-auto mt-4 rounded-full w-20" />
          <p className="text-warm-white/60 mt-4 font-sans">
            Centrally placed on Khammam’s bypass road, enabling quick transit in and out of the city.
          </p>
        </div>

        {/* Section Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Contact & Transit Details */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/40 border border-teal-950/20 rounded-3xl p-8 shadow-xl">
            <div>
              <h3 className="text-2xl font-serif font-bold text-warm-white mb-6">Our Address</h3>
              
              {/* Address detail */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-warm-white">Sri Sri Sri Excellency</h4>
                    <p className="text-sm text-warm-white/70 leading-relaxed mt-1">
                      Usha Hari Convention Building, Bypass Road,<br />
                      Beside Railway Over Bridge, Raparthi Nagar,<br />
                      Khammam, Telangana - 507003, India.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-warm-white">Phone Support</h4>
                    <p className="text-sm text-accent font-medium mt-0.5">+91 8742 245678, +91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-warm-white">Email Address</h4>
                    <p className="text-sm text-accent font-medium mt-0.5">stay@srisrisriexcellency.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Highlights */}
            <div className="border-t border-teal-950/30 pt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-white/40 mb-4">
                Nearby Transit & Points of Interest
              </h4>
              <div className="space-y-4">
                {nearbyPlaces.map((place, index) => {
                  const Icon = place.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="p-2 bg-teal-950/30 border border-teal-500/10 rounded-lg text-teal-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-grow flex justify-between items-baseline flex-wrap gap-1">
                        <span className="text-xs sm:text-sm font-medium text-warm-white/80">{place.name}</span>
                        <span className="text-[10px] sm:text-xs text-warm-white/40 font-mono">{place.distance}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 h-[400px] lg:h-auto min-h-[450px] relative rounded-3xl overflow-hidden border border-teal-950/30 shadow-2xl">
            <iframe
              src="https://maps.google.com/maps?q=Sri%20Sri%20Sri%20Excellency,%20Bypass%20Road,%20Khammam&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) opacity(0.85)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sri Sri Sri Excellency Location Map"
              className="absolute inset-0 w-full h-full"
            ></iframe>
            {/* Ambient vignette */}
            <div className="absolute inset-0 pointer-events-none border border-teal-500/10 rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
