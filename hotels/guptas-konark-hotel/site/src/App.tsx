import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Rooms from './components/Rooms'
import Amenities from './components/Amenities'
import Reviews from './components/Reviews'
import Location from './components/Location'
import Booking from './components/Booking'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <About />
      <Rooms />
      <Amenities />
      <Reviews />
      <Location />
      <Booking />
      <Footer />
    </div>
  )
}
