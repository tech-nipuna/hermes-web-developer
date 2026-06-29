
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  role: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
}

export default function Reviews() {
  const reviews: Review[] = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      role: 'Business Traveler (Google Verified)',
      rating: 5,
      date: '2 weeks ago',
      text: 'Extremely clean and comfortable rooms. The hotel staff was polite and went out of their way to help with taxi arrangements. The bypass road location beside the Raparthi Nagar over bridge was perfect for transit.',
      avatar: 'RK'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Family Trip (Verified Guest)',
      rating: 4,
      date: '1 month ago',
      text: 'Excellent room service and hygiene standards! The staff is very warm. The complimentary breakfast was freshly made and tasty, although the variety was slightly limited. Looking forward to staying again.',
      avatar: 'PS'
    },
    {
      id: 3,
      name: 'David Miller',
      role: 'International Consultant',
      rating: 5,
      date: '1 month ago',
      text: 'Sri Sri Sri Excellency is my top recommendation in Khammam. Excellent Wi-Fi speed, powerful A/C, and banquet facilities. The hotel avoids downtown traffic while keeping everything easily reachable.',
      avatar: 'DM'
    },
    {
      id: 4,
      name: 'Venkatesh R.',
      role: 'Leisure Traveler (Google Reviewer)',
      rating: 5,
      date: '2 months ago',
      text: 'Superb boutique feeling. Very clean beds, modern bathroom, and reliable room service. Checking in was smooth even though I arrived very late. The staff is highly trained and professional.',
      avatar: 'VR'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<number | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <section id="reviews" className="py-24 bg-slate-900 text-warm-white relative overflow-hidden">
      {/* Decorative blurred rings */}
      <div className="absolute top-1/2 -right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 -left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent uppercase tracking-widest font-semibold text-sm">
            Guest Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mt-2">
            Reviews & Feedback
          </h2>
          <div className="h-1 bg-gradient-to-r from-teal-500 to-accent mx-auto mt-4 rounded-full w-20" />
          <p className="text-warm-white/60 mt-4 font-sans">
            Hear from our visitors who enjoyed our hospitality near Raparthi Nagar, Khammam.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[380px] sm:min-h-[320px] bg-slate-950/40 border border-teal-950/30 rounded-3xl p-8 sm:p-12 flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="absolute top-6 right-8 text-teal-500/10 pointer-events-none">
            <Quote className="w-24 h-24 stroke-[4]" />
          </div>

          <div className="relative flex-grow flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex flex-col justify-center"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < reviews[activeIndex].rating
                          ? 'fill-accent text-accent'
                          : 'text-warm-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-base sm:text-lg md:text-xl font-serif text-warm-white/90 leading-relaxed italic mb-8">
                  "{reviews[activeIndex].text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md">
                    {reviews[activeIndex].avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-warm-white">{reviews[activeIndex].name}</h4>
                    <p className="text-xs text-warm-white/40 flex items-center gap-2">
                      <span>{reviews[activeIndex].role}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50" />
                      <span>{reviews[activeIndex].date}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-teal-950/30">
            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'bg-accent w-8'
                      : 'bg-warm-white/20 hover:bg-warm-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="p-3 bg-teal-950/20 hover:bg-teal-950/40 border border-teal-500/20 rounded-xl text-warm-white hover:text-accent transition-colors duration-200"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 bg-teal-950/20 hover:bg-teal-950/40 border border-teal-500/20 rounded-xl text-warm-white hover:text-accent transition-colors duration-200"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Brand stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 text-center">
          <div className="bg-slate-950/30 border border-teal-950/20 p-6 rounded-2xl">
            <p className="text-3xl font-bold font-serif text-accent">180+</p>
            <p className="text-xs text-warm-white/50 mt-1 uppercase tracking-wider">Happy Reviews</p>
          </div>
          <div className="bg-slate-950/30 border border-teal-950/20 p-6 rounded-2xl">
            <p className="text-3xl font-bold font-serif text-teal-400">4.2</p>
            <p className="text-xs text-warm-white/50 mt-1 uppercase tracking-wider">Average Rating</p>
          </div>
          <div className="bg-slate-950/30 border border-teal-950/20 p-6 rounded-2xl">
            <p className="text-3xl font-bold font-serif text-accent">100%</p>
            <p className="text-xs text-warm-white/50 mt-1 uppercase tracking-wider">Guest Trust</p>
          </div>
          <div className="bg-slate-950/30 border border-teal-950/20 p-6 rounded-2xl">
            <p className="text-3xl font-bold font-serif text-teal-400">24h</p>
            <p className="text-xs text-warm-white/50 mt-1 uppercase tracking-wider">Attentive Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
