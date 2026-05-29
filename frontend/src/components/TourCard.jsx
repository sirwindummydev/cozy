import { Link } from 'react-router-dom'
import { FaStar, FaClock, FaUsers, FaMapMarkerAlt } from 'react-icons/fa'

const difficultyBadge = {
  easy: 'badge-easy',
  moderate: 'badge-moderate',
  challenging: 'badge-challenging',
}

export default function TourCard({ tour }) {
  const coverImg = tour.cover || tour.cover_image_url || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600`

  return (
    <div className="card group cursor-pointer">
      <Link to={`/tours/${tour.slug}`}>
        {/* Image */}
        <div className="relative overflow-hidden h-56">
          <img
            src={coverImg}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {tour.is_featured && (
              <span className="badge bg-accent-500 text-white text-xs">Featured</span>
            )}
            <span className={difficultyBadge[tour.difficulty] || 'badge bg-gray-100 text-gray-700'}>
              {tour.difficulty}
            </span>
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1">
            {tour.discount_price ? (
              <div className="text-right">
                <span className="text-xs text-gray-400 line-through">${tour.price}</span>
                <span className="text-primary-700 font-bold text-lg ml-1">${tour.discount_price}</span>
              </div>
            ) : (
              <span className="text-primary-700 font-bold text-lg">from ${tour.price}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
            <FaMapMarkerAlt className="text-accent-500 text-xs" />
            <span>{tour.location}, {tour.country}</span>
          </div>

          <h3 className="font-semibold text-lg text-primary-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
            {tour.title}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{tour.summary}</p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaClock className="text-primary-400" />
                {tour.duration}
              </span>
              <span className="flex items-center gap-1">
                <FaUsers className="text-primary-400" />
                {tour.max_group_size}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FaStar className="text-accent-500 text-sm" />
              <span className="font-semibold text-sm text-primary-900">{tour.rating}</span>
              <span className="text-gray-400 text-xs">({tour.rating_quantity})</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
