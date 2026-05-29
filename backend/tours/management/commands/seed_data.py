from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from tours.models import Category, Tour, TourImage, TourSchedule
from accounts.models import UserProfile
from datetime import date, timedelta


TOURS_DATA = [
    {
        'title': 'Bali Paradise Adventure',
        'category': 'Beach & Islands',
        'summary': 'Experience the magic of Bali with pristine beaches, ancient temples, and vibrant culture.',
        'description': 'Discover the enchanting island of Bali with our comprehensive 7-day adventure. Explore terraced rice paddies, sacred temples, and stunning volcanic landscapes. Immerse yourself in Balinese culture through traditional dance performances, cooking classes, and village visits. Relax on world-class beaches and rejuvenate with traditional spa treatments.',
        'price': 1299.00,
        'duration': '7 Days / 6 Nights',
        'max_group_size': 12,
        'difficulty': 'easy',
        'location': 'Bali',
        'country': 'Indonesia',
        'cover_image_url': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        'is_featured': True,
        'rating': 4.8,
        'rating_quantity': 124,
        'highlights': 'Visit Tanah Lot Temple at sunset\nRice terrace trekking in Tegalalang\nMount Batur sunrise hike\nUbud Monkey Forest visit\nTraditional Balinese cooking class',
        'includes': 'Hotel accommodation\nDaily breakfast\nAirport transfers\nGuided tours\nSpa treatment',
        'excludes': 'International flights\nPersonal expenses\nTravel insurance\nOptional activities',
        'images': [
            {'url': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', 'caption': 'Bali Temples'},
            {'url': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600', 'caption': 'Rice Terraces'},
            {'url': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600', 'caption': 'Beach Sunset'},
        ]
    },
    {
        'title': 'Swiss Alps Mountain Trek',
        'category': 'Mountain & Hiking',
        'summary': 'Conquer the majestic Swiss Alps with breathtaking views and challenging mountain trails.',
        'description': 'Embark on an unforgettable alpine adventure through the heart of Switzerland. Trek through pristine mountain meadows, past crystal-clear lakes, and up to soaring peaks with views that will take your breath away. Stay in charming mountain huts and experience authentic Swiss hospitality while exploring some of the world\'s most spectacular scenery.',
        'price': 2499.00,
        'duration': '10 Days / 9 Nights',
        'max_group_size': 8,
        'difficulty': 'challenging',
        'location': 'Swiss Alps',
        'country': 'Switzerland',
        'cover_image_url': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'is_featured': True,
        'rating': 4.9,
        'rating_quantity': 89,
        'highlights': 'Jungfraujoch - Top of Europe\nMatterhorn viewpoint\nLake Geneva boat tour\nInterlaken paragliding\nGrindelwald glacier walk',
        'includes': 'Mountain hut accommodation\nAll meals\nCable car passes\nProfessional guide\nFirst aid kit',
        'excludes': 'Flights to Geneva\nPersonal gear\nTravel insurance\nAlcohol',
        'images': [
            {'url': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', 'caption': 'Alpine Peaks'},
            {'url': 'https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?w=600', 'caption': 'Mountain Lake'},
            {'url': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600', 'caption': 'Starry Alps'},
        ]
    },
    {
        'title': 'Machu Picchu Explorer',
        'category': 'Historical & Cultural',
        'summary': 'Journey to the lost city of the Incas and discover ancient Andean civilizations.',
        'description': 'Trek the legendary Inca Trail to reach the awe-inspiring citadel of Machu Picchu. Explore the Sacred Valley, visit traditional Andean villages, and uncover the mysteries of one of the world\'s greatest archaeological wonders. This carefully crafted itinerary blends adventure, history, and cultural immersion for an experience you\'ll never forget.',
        'price': 1899.00,
        'duration': '8 Days / 7 Nights',
        'max_group_size': 10,
        'difficulty': 'moderate',
        'location': 'Cusco & Machu Picchu',
        'country': 'Peru',
        'cover_image_url': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
        'is_featured': True,
        'rating': 4.7,
        'rating_quantity': 156,
        'highlights': 'Classic Inca Trail trek\nMachu Picchu sunrise\nSacred Valley tour\nCusco city exploration\nLocal market visit',
        'includes': 'Lodge and camping accommodation\nAll meals on trail\nTrain ticket\nEntrance fees\nPorter service',
        'excludes': 'Flights to Lima\nVisa fees\nPersonal equipment\nTips',
        'images': [
            {'url': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600', 'caption': 'Machu Picchu'},
            {'url': 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600', 'caption': 'Inca Trail'},
            {'url': 'https://images.unsplash.com/photo-1565619624098-a58cb6a89b44?w=600', 'caption': 'Cusco City'},
        ]
    },
    {
        'title': 'Serengeti Safari Experience',
        'category': 'Wildlife & Safari',
        'summary': 'Witness the great wildebeest migration and Africa\'s Big Five in their natural habitat.',
        'description': 'Experience the raw beauty of Africa on this spectacular safari through Tanzania\'s iconic Serengeti National Park. Witness millions of wildebeest during the great migration, spot lions, elephants, leopards, and cheetahs in their natural environment, and fall asleep under a canopy of stars in luxury tented camps.',
        'price': 3299.00,
        'duration': '9 Days / 8 Nights',
        'max_group_size': 6,
        'difficulty': 'easy',
        'location': 'Serengeti',
        'country': 'Tanzania',
        'cover_image_url': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
        'is_featured': True,
        'rating': 4.9,
        'rating_quantity': 67,
        'highlights': 'Great Migration crossing\nNgorongoro Crater game drive\nMasai village visit\nHot air balloon safari\nSunset bush walk',
        'includes': 'Luxury tented camp\nAll meals\n4x4 game drive vehicle\nProfessional safari guide\nPark fees',
        'excludes': 'International flights\nVisa fees\nGratuities\nPersonal shopping',
        'images': [
            {'url': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600', 'caption': 'Safari Lions'},
            {'url': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600', 'caption': 'Elephant Herd'},
            {'url': 'https://images.unsplash.com/photo-1504945005722-33670dcaf685?w=600', 'caption': 'Savanna Sunset'},
        ]
    },
    {
        'title': 'Tokyo & Kyoto Cultural Journey',
        'category': 'Historical & Cultural',
        'summary': 'Discover the perfect blend of ultramodern Tokyo and ancient Kyoto traditions.',
        'description': 'Immerse yourself in Japan\'s fascinating culture on this expertly curated journey through two of Asia\'s most captivating cities. Experience the neon-lit streets of Shibuya, meditate in Zen gardens, participate in a traditional tea ceremony, and witness the timeless beauty of geishas in Gion district.',
        'price': 2199.00,
        'duration': '12 Days / 11 Nights',
        'max_group_size': 14,
        'difficulty': 'easy',
        'location': 'Tokyo & Kyoto',
        'country': 'Japan',
        'cover_image_url': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
        'is_featured': False,
        'rating': 4.8,
        'rating_quantity': 203,
        'highlights': 'Mount Fuji viewpoint\nTea ceremony experience\nFushimi Inari shrine hike\nTsukiji fish market\nNara deer park',
        'includes': 'Hotel accommodation\nBreakfast daily\nBullet train pass\nCultural workshop\nAirport transfers',
        'excludes': 'Flights to Tokyo\nLunches and dinners\nSouvenirs\nOptional excursions',
        'images': [
            {'url': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600', 'caption': 'Kyoto Temple'},
            {'url': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', 'caption': 'Tokyo Skyline'},
            {'url': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600', 'caption': 'Mount Fuji'},
        ]
    },
    {
        'title': 'Greek Islands Cruise',
        'category': 'Beach & Islands',
        'summary': 'Sail through the azure Aegean Sea visiting the most beautiful Greek islands.',
        'description': 'Set sail on a magnificent voyage through the Greek archipelago, stopping at enchanting islands steeped in mythology and history. Visit Santorini\'s iconic blue-domed churches, swim in the crystal waters of Mykonos, explore ancient ruins on Rhodes, and savor fresh Mediterranean cuisine at every port.',
        'price': 2799.00,
        'duration': '10 Days / 9 Nights',
        'max_group_size': 16,
        'difficulty': 'easy',
        'location': 'Aegean Sea',
        'country': 'Greece',
        'cover_image_url': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
        'is_featured': False,
        'rating': 4.7,
        'rating_quantity': 178,
        'highlights': 'Santorini caldera view\nMykonos beach parties\nRhodes medieval old town\nOia sunset experience\nSnorkeling in crystal waters',
        'includes': 'Cabin accommodation\nAll meals onboard\nIsland tours\nSnorkeling equipment\nPort fees',
        'excludes': 'Flights to Athens\nDrinks onboard\nPersonal shopping\nGratuities',
        'images': [
            {'url': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600', 'caption': 'Santorini'},
            {'url': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600', 'caption': 'Mykonos'},
            {'url': 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=600', 'caption': 'Greek Coast'},
        ]
    },
]


class Command(BaseCommand):
    help = 'Seed database with sample tour data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Create admin user
        if not User.objects.filter(username='admin').exists():
            admin = User.objects.create_superuser('admin', 'admin@cozytravel.com', 'admin123')
            UserProfile.objects.get_or_create(user=admin)
            self.stdout.write(self.style.SUCCESS('Admin user created: admin / admin123'))

        # Create categories
        categories = {}
        for cat_name in ['Beach & Islands', 'Mountain & Hiking', 'Historical & Cultural',
                          'Wildlife & Safari', 'City & Urban', 'Adventure & Extreme']:
            cat, _ = Category.objects.get_or_create(name=cat_name, defaults={'icon': 'FaGlobe'})
            categories[cat_name] = cat

        # Create tours
        today = date.today()
        for tour_data in TOURS_DATA:
            images = tour_data.pop('images', [])
            cat_name = tour_data.pop('category')
            tour, created = Tour.objects.get_or_create(
                title=tour_data['title'],
                defaults={**tour_data, 'category': categories[cat_name]}
            )
            if created:
                for i, img in enumerate(images):
                    TourImage.objects.create(
                        tour=tour, image_url=img['url'],
                        caption=img['caption'], order=i,
                        is_primary=(i == 0)
                    )
                # Create schedules
                for month_offset in range(1, 4):
                    start = today + timedelta(days=30 * month_offset)
                    end = start + timedelta(days=7)
                    TourSchedule.objects.create(
                        tour=tour, start_date=start, end_date=end,
                        available_slots=tour.max_group_size
                    )
                self.stdout.write(f'  Created tour: {tour.title}')

        self.stdout.write(self.style.SUCCESS('Data seeded successfully!'))
