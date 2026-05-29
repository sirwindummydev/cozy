import { Link } from 'react-router-dom'
import { FaPlane, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center">
                <FaPlane className="text-white text-lg" />
              </div>
              <div>
                <span className="font-display font-bold text-xl">Cozy Travel</span>
                <span className="text-accent-400 text-xs font-medium tracking-wider block">& TOURS</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Creating unforgettable travel experiences since 2010. We connect you with the world's most extraordinary destinations.
            </p>
            <div className="flex gap-3">
              {[FaFacebook, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent-500 transition-colors duration-200">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Tours', to: '/tours' },
                { label: 'Destinations', to: '/tours' },
                { label: 'About Us', to: '/#about' },
                { label: 'Contact', to: '/#contact' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-gray-400 hover:text-accent-400 transition-colors text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-accent-500 rounded-full" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Destinations */}
          <div>
            <h4 className="font-semibold text-lg mb-5">Top Destinations</h4>
            <ul className="space-y-3">
              {['Bali, Indonesia', 'Swiss Alps', 'Machu Picchu', 'Safari Tanzania', 'Tokyo, Japan', 'Greek Islands'].map((dest) => (
                <li key={dest}>
                  <Link to="/tours" className="text-gray-400 hover:text-accent-400 transition-colors text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-accent-500 rounded-full" />
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-accent-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">123 Travel Street, Tourism City, TC 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-accent-400 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-gray-400 hover:text-accent-400 text-sm transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-accent-400 flex-shrink-0" />
                <a href="mailto:hello@cozytravel.com" className="text-gray-400 hover:text-accent-400 text-sm transition-colors">hello@cozytravel.com</a>
              </li>
            </ul>
            <div className="mt-6 bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-300 font-medium mb-1">Office Hours</p>
              <p className="text-xs text-gray-400">Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p className="text-xs text-gray-400">Sat: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2024 Cozy Travel and Tours. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
