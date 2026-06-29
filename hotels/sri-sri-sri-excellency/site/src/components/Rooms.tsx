import { motion } from 'framer-motion';
import { BedDouble, Users, Maximize, Shield } from 'lucide-react';

interface RoomType {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  capacity: string;
  size: string;
  bed: string;
  amenities: string[];
}

export default function Rooms() {
  const rooms: RoomType[] = [
    {
      id: 'standard',
      name: 'Standard Room',
      price: '₹1,650',
      description: 'Elegant comfort tailored for solo travelers and business professionals seeking a clean, focused, and cozy stay.',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      capacity: '2 Guests',
      size: '220 sq. ft.',
      bed: '1 Queen Bed',
      amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Daily Housekeeping']
    },
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      price: '₹2,600',
      description: 'Spacious accommodation equipped with extra luxury fixtures and comfortable seating for a deeply relaxing stay.',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      capacity: '2-3 Guests',
      size: '310 sq. ft.',
      bed: '1 King Bed',
      amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', '24-hour Room Service', 'Mini Fridge']
    },
    {
      id: 'executive',
      name: 'Executive Room',
      price: '₹3,900',
      description: 'The pinnacle of comfort at Sri Sri Sri Excellency. Sweeping bypass view, work desk, and premium boutique furnishings.',
      image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
      capacity: '3 Guests',
      size: '420 sq. ft.',
      bed: '1 Royal King Bed',
      amenities: ['Free Wi-Fi', 'Air Conditioning', 'Smart TV', '24-hour Room Service', 'Banquet Access', 'Priority Checkout']
    }
  ];

  const handleBookRoom = (roomId: string) => {
    const formElement = document.querySelector('#booking');
    const selectElement = document.querySelector('#room-select') as HTMLSelectElement;
    
    if (selectElement) {
      selectElement.value = roomId;
      // trigger event so react updates state
      const event = new Event('change', { bubbles: true });
      selectElement.dispatchEvent(event);
    }
    
    if (formElement) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = formElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="rooms" className="py-24 bg-slate-900 text-warm-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent uppercase tracking-widest font-semibold text-sm"
          >
            Elegant Accommodation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mt-2"
          >
            Rooms & Rates
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-teal-500 to-accent mx-auto mt-4 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-warm-white/60 mt-4"
          >
            Indulge in spaces carefully structured with modern aesthetics, clean bedding, and comprehensive in-room amenities.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, idx) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="bg-slate-950/40 border border-teal-950/30 rounded-2xl overflow-hidden hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-950/20 transition-all duration-300 flex flex-col group"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-teal-500/30 px-4 py-2 rounded-xl text-accent font-serif font-bold text-lg">
                  {room.price} <span className="text-xs text-warm-white/60 font-sans font-normal">/ night</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-serif font-bold tracking-wide text-warm-white mb-2">
                  {room.name}
                </h3>
                <p className="text-sm text-warm-white/70 leading-relaxed mb-6 flex-grow">
                  {room.description}
                </p>

                {/* Specs Row */}
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-teal-950/40 mb-6 text-xs text-warm-white/60">
                  <div className="flex items-center gap-1.5 justify-center">
                    <Users className="w-4 h-4 text-teal-400" />
                    <span>{room.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center border-l border-r border-teal-950/40">
                    <Maximize className="w-4 h-4 text-teal-400" />
                    <span>{room.size}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <BedDouble className="w-4 h-4 text-teal-400" />
                    <span>{room.bed}</span>
                  </div>
                </div>

                {/* Amenities List */}
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-wider text-warm-white/40 font-semibold mb-2">Room Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="text-[10px] sm:text-xs bg-teal-950/30 text-teal-300 border border-teal-950/50 px-2.5 py-1 rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => handleBookRoom(room.id)}
                  className="w-full bg-transparent hover:bg-accent text-accent hover:text-slate-950 border border-accent/40 hover:border-accent py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Select & Reserve
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
