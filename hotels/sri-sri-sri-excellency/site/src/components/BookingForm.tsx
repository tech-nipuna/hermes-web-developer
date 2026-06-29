import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, Award, CheckCircle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
  requests: string;
}

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    roomType: 'standard',
    guests: 2,
    requests: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmId, setConfirmId] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [numNights, setNumNights] = useState(0);

  const roomRates: Record<string, number> = {
    standard: 1650,
    deluxe: 2600,
    executive: 3900
  };

  const roomNames: Record<string, string> = {
    standard: 'Standard Room',
    deluxe: 'Deluxe Room',
    executive: 'Executive Room'
  };

  // Get today's date formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate nights and total price dynamically
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const date1 = new Date(formData.checkIn);
      const date2 = new Date(formData.checkOut);
      const diffTime = date2.getTime() - date1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setNumNights(diffDays);
        setTotalCost(diffDays * roomRates[formData.roomType]);
      } else {
        setNumNights(0);
        setTotalCost(0);
      }
    } else {
      setNumNights(0);
      setTotalCost(0);
    }
  }, [formData.checkIn, formData.checkOut, formData.roomType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }));
    
    // Clear validation error when editing
    if (errors[name as keyof BookingFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    } else if (new Date(formData.checkIn) < new Date(todayStr)) {
      newErrors.checkIn = 'Check-in cannot be in the past';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    } else if (formData.checkIn && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      newErrors.checkOut = 'Check-out must be after check-in';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setConfirmId('SSE-' + Math.floor(100000 + Math.random() * 900000));
    }, 1500);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      roomType: 'standard',
      guests: 2,
      requests: ''
    });
    setErrors({});
  };

  return (
    <section id="booking" className="py-24 bg-slate-900 text-warm-white relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-5">
            <span className="text-accent uppercase tracking-widest font-semibold text-sm">
              Secure Reservation
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mt-2 mb-6">
              Book Your Stay
            </h2>
            <p className="text-warm-white/70 text-base sm:text-lg mb-8 leading-relaxed font-sans">
              Plan your travel with complete peace of mind. Fill in your details, check the real-time pricing estimate, and lock in your contemporary boutique room.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-warm-white">No Booking Fees</h4>
                  <p className="text-sm text-warm-white/50">Direct booking means zero agency commissions or hidden surcharges.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-warm-white">Flexible Cancellation</h4>
                  <p className="text-sm text-warm-white/50">Cancel or modify up to 24 hours prior to check-in for absolute freedom.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-slate-950/55 border border-teal-950/45 p-6 sm:p-10 rounded-3xl shadow-2xl relative"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-white/50 font-bold mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-warm-white/30" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Verma"
                      className={`w-full bg-slate-900 border ${
                        errors.fullName ? 'border-red-500/50 focus:border-red-500' : 'border-teal-950/50 focus:border-accent'
                      } text-warm-white rounded-xl pl-11 pr-4 py-3 outline-none text-sm transition-colors`}
                    />
                  </div>
                  {errors.fullName && <p className="text-red-400 text-xs mt-1.5">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-white/50 font-bold mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-warm-white/30" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@domain.com"
                      className={`w-full bg-slate-900 border ${
                        errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-teal-950/50 focus:border-accent'
                      } text-warm-white rounded-xl pl-11 pr-4 py-3 outline-none text-sm transition-colors`}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-white/50 font-bold mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-warm-white/30" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className={`w-full bg-slate-900 border ${
                        errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-teal-950/50 focus:border-accent'
                      } text-warm-white rounded-xl pl-11 pr-4 py-3 outline-none text-sm transition-colors`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-white/50 font-bold mb-2">Room Type</label>
                  <select
                    id="room-select"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-teal-950/50 focus:border-accent text-warm-white rounded-xl px-4 py-3 outline-none text-sm transition-colors cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23fefae0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                  >
                    <option value="standard">Standard Room (₹1,650 / night)</option>
                    <option value="deluxe">Deluxe Room (₹2,600 / night)</option>
                    <option value="executive">Executive Room (₹3,900 / night)</option>
                  </select>
                </div>

                {/* Check In Date */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-white/50 font-bold mb-2">Check-In Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-warm-white/30 pointer-events-none" />
                    <input
                      type="date"
                      name="checkIn"
                      min={todayStr}
                      value={formData.checkIn}
                      onChange={handleChange}
                      className={`w-full bg-slate-900 border ${
                        errors.checkIn ? 'border-red-500/50 focus:border-red-500' : 'border-teal-950/50 focus:border-accent'
                      } text-warm-white rounded-xl pl-11 pr-4 py-3 outline-none text-sm transition-colors cursor-pointer scheme-dark`}
                    />
                  </div>
                  {errors.checkIn && <p className="text-red-400 text-xs mt-1.5">{errors.checkIn}</p>}
                </div>

                {/* Check Out Date */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-white/50 font-bold mb-2">Check-Out Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-warm-white/30 pointer-events-none" />
                    <input
                      type="date"
                      name="checkOut"
                      min={formData.checkIn || todayStr}
                      value={formData.checkOut}
                      onChange={handleChange}
                      className={`w-full bg-slate-900 border ${
                        errors.checkOut ? 'border-red-500/50 focus:border-red-500' : 'border-teal-950/50 focus:border-accent'
                      } text-warm-white rounded-xl pl-11 pr-4 py-3 outline-none text-sm transition-colors cursor-pointer scheme-dark`}
                    />
                  </div>
                  {errors.checkOut && <p className="text-red-400 text-xs mt-1.5">{errors.checkOut}</p>}
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-white/50 font-bold mb-2">Guests Count</label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-teal-950/50 focus:border-accent text-warm-white rounded-xl px-4 py-3 outline-none text-sm transition-colors cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23fefae0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>

                {/* Dynamic Price Display */}
                <div className="flex flex-col justify-end">
                  {numNights > 0 ? (
                    <div className="bg-teal-500/10 border border-teal-500/25 rounded-xl p-3.5 text-center flex flex-col justify-center">
                      <p className="text-[10px] uppercase tracking-wider text-teal-400 font-bold">Estimated Cost</p>
                      <p className="text-xl font-serif font-black text-accent mt-0.5">
                        ₹{totalCost.toLocaleString('en-IN')}{' '}
                        <span className="text-xs text-warm-white/60 font-sans font-normal">
                          ({numNights} night{numNights > 1 ? 's' : ''})
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-900/40 border border-teal-950/20 rounded-xl p-3.5 text-center flex flex-col justify-center h-[52px]">
                      <p className="text-[10px] uppercase tracking-wider text-warm-white/40 font-bold">Pricing Estimate</p>
                      <p className="text-xs text-warm-white/50">Select dates to calculate</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              <div className="mb-8">
                <label className="block text-xs uppercase tracking-wider text-warm-white/50 font-bold mb-2">Special Requests (Optional)</label>
                <textarea
                  name="requests"
                  value={formData.requests}
                  onChange={handleChange}
                  placeholder="e.g. Extra pillows, early check-in, ground floor request..."
                  rows={3}
                  className="w-full bg-slate-900 border border-teal-950/50 focus:border-accent text-warm-white rounded-xl px-4 py-3 outline-none text-sm transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-slate-950 py-4 rounded-xl font-bold transition-all duration-200 shadow-xl shadow-accent/20 hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing Reservation...</span>
                  </>
                ) : (
                  <span>Request Booking Confirmation</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="bg-slate-900 border border-teal-500/20 max-w-lg w-full rounded-3xl p-8 shadow-2xl relative text-center"
            >
              <button
                onClick={handleCloseSuccess}
                className="absolute top-6 right-6 p-2 bg-slate-950/50 hover:bg-slate-950 border border-teal-500/10 rounded-xl text-warm-white/60 hover:text-warm-white transition-colors"
                aria-label="Close success popup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-warm-white mb-2">Booking Request Sent!</h3>
              <p className="text-sm text-warm-white/60 mb-6">
                Thank you, <span className="font-semibold text-warm-white">{formData.fullName}</span>. Our reception team will call or email you within 30 minutes to confirm your reservation.
              </p>

              {/* Summary Details */}
              <div className="bg-slate-950/60 border border-teal-950/30 rounded-2xl p-5 mb-8 text-left space-y-3.5 text-sm">
                <div className="flex justify-between border-b border-teal-950/30 pb-2.5">
                  <span className="text-warm-white/40">Confirmation ID</span>
                  <span className="font-mono font-bold text-accent">{confirmId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-white/40">Room Category</span>
                  <span className="font-semibold text-warm-white">{roomNames[formData.roomType]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-white/40">Dates</span>
                  <span className="text-warm-white">{formData.checkIn} to {formData.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-white/40">Guests Count</span>
                  <span className="text-warm-white">{formData.guests} Guest{formData.guests > 1 ? 's' : ''}</span>
                </div>
                {numNights > 0 && (
                  <div className="flex justify-between border-t border-teal-950/30 pt-2.5 text-base font-serif">
                    <span className="text-warm-white/40 font-sans text-sm">Total Quote</span>
                    <span className="font-bold text-accent">₹{totalCost.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleCloseSuccess}
                className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-teal-600/10 cursor-pointer"
              >
                Return to Site
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
