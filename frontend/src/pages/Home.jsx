import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaPlay, FaStar, FaUsers, FaGlobe, FaAward, FaArrowRight, FaChevronDown } from 'react-icons/fa'
import TourCard from '../components/TourCard'
import { getFeaturedTours, getCategories } from '../services/api'

const HERO_BG = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80'

const STATS = [
  { icon: FaUsers, value: '15,000+', label: 'Happy Travelers' },
  { icon: FaGlobe, value: '80+', label: 'Destinations' },
  { icon: FaStar, value: '4.9/5', label: 'Average Rating' },
  { icon: FaAward, value: '15+', label: 'Years Experience' },
]

const DESTINATIONS = [
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', tours: 12 },
  { name: 'Swiss Alps', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', tours: 8 },
  { name: 'Machu Picchu', country: 'Peru', img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400', tours: 6 },
  { name: 'Serengeti', country: 'Tanzania', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400', tours: 9 },
  { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400', tours: 14 },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400', tours: 7 },
]

const TESTIMONIALS = [
  { name: 'Sarah Johnson', role: 'Adventure Traveler', img: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 5, text: 'The Bali tour was absolutely magical! Every detail was perfectly arranged. Our guide was knowledgeable and passionate. I\'ll definitely book with Cozy Travel again!' },
  { name: 'Michael Chen', role: 'Family Traveler', img: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 5, text: 'Took my family on the Swiss Alps trek. The organization was flawless, accommodations were cozy, and the views were breathtaking. Best family vacation ever!' },
  { name: 'Emma Williams', role: 'Solo Traveler', img: 'https://randomuser.me/api/portraits/women/68.jpg', rating: 5, text: 'As a solo traveler, I was nervous but the team made me feel so welcome. The Machu Picchu tour was life-changing. Highly recommend for solo adventurers!' },
]

export default function Home() {
  const [featuredTours, setFeaturedTours] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getFeaturedTours().then(({ data }) => setFeaturedTours(data.results || data)).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/tours?search=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 via-primary-900/50 to-primary-900/80" />

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-accent-300 border border-accent-400/30 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <FaStar className="text-accent-400" />
            Rated #1 Travel Agency 2024
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Explore the World with
            <span className="text-accent-400 block">Cozy Travel</span>
          </h1>

          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover extraordinary destinations, create lifelong memories, and experience the world's wonders with our expertly crafted tours.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            <button type="submit" className="btn-primary px-8 py-4 text-base rounded-xl whitespace-nowrap">
              Search Tours
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300">
            <span>Popular:</span>
            {['Bali', 'Swiss Alps', 'Machu Picchu', 'Safari', 'Tokyo'].map((dest) => (
              <button key={dest} onClick={() => navigate(`/tours?search=${dest}`)} className="hover:text-accent-400 transition-colors underline underline-offset-2">
                {dest}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <a href="#featured" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white flex flex-col items-center gap-1 animate-bounce">
          <span className="text-xs">Scroll Down</span>
          <FaChevronDown />
        </a>
      </section>

      {/* STATS */}
      <section className="bg-primary-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center text-white">
                <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-xl" />
                </div>
                <p className="text-3xl font-bold font-display">{value}</p>
                <p className="text-gray-300 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TOURS */}
      <section id="featured" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent-500 font-semibold mb-2 tracking-wider uppercase text-sm">Top Picks</p>
            <h2 className="section-title">Featured Tours</h2>
            <p className="section-subtitle">Handpicked experiences for the modern adventurer</p>
          </div>

          {featuredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.slice(0, 6).map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/tours" className="btn-secondary inline-flex items-center gap-2">
              View All Tours <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent-500 font-semibold mb-2 tracking-wider uppercase text-sm">Explore</p>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">The world's most breathtaking places await you</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {DESTINATIONS.map((dest, i) => (
              <Link
                key={dest.name}
                to={`/tours?search=${dest.name}`}
                className={`relative group overflow-hidden rounded-2xl cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                style={{ height: i === 0 ? '400px' : '190px' }}
              >
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className={`font-bold ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{dest.name}</h3>
                  <p className="text-gray-300 text-sm">{dest.country}</p>
                  <span className="text-accent-400 text-xs">{dest.tours} tours available</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="about" className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent-400 font-semibold mb-2 tracking-wider uppercase text-sm">Why Cozy Travel</p>
              <h2 className="font-display text-4xl font-bold mb-6">Travel Smarter with Experts Who Care</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                We've been crafting unforgettable journeys since 2010. Our passionate team of travel experts ensures every tour exceeds expectations with personalized service and meticulous attention to detail.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Expert Local Guides', desc: 'Knowledgeable guides who bring destinations to life' },
                  { title: 'Small Group Sizes', desc: 'Intimate groups for a more personalized experience' },
                  { title: 'All-Inclusive Packages', desc: 'Transparent pricing with no hidden costs' },
                  { title: '24/7 Support', desc: 'Our team is always available when you need us' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-gray-400 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <Link to="/tours" className="btn-primary">Explore Tours</Link>
                <button className="flex items-center gap-2 text-white hover:text-accent-400 transition-colors">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <FaPlay className="text-sm ml-0.5" />
                  </div>
                  Watch Video
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400" alt="Travel" className="rounded-2xl h-64 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400" alt="Adventure" className="rounded-2xl h-64 w-full object-cover mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent-500 font-semibold mb-2 tracking-wider uppercase text-sm">Reviews</p>
            <h2 className="section-title">What Our Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(({ name, role, img, rating, text }) => (
              <div key={name} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <FaStar key={i} className="text-accent-500 text-sm" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <img src={img} alt={name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-primary-900">{name}</p>
                    <p className="text-gray-500 text-sm">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="contact" className="py-20 bg-accent-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-white/80 text-lg mb-8">Subscribe to get exclusive deals, travel tips, and early access to new tours.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
            />
            <button type="submit" className="bg-primary-900 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-white/60 text-sm mt-4">No spam, unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  )
}
