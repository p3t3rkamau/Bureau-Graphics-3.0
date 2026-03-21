import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import heroImage from '../../assets/img/img2.jpg';

interface Slide {
  id: number;
  badge: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

const slides: Slide[] = [
  {
    id: 1,
    badge: 'Stickers',
    title: 'Reflective Sticker printing',
    description: 'Reflective Stickers Printing in Nairobi Honeycomb Brand your storefront, Vehicle or Display Stands stand-out with Reflective Honeycomb Stickers from Bureau Graphics',
    price: 'From KES 2,500',
    image: heroImage,
    category: 'stickers',
  },
  {
    id: 2,
    badge: 'Business Cards',
    title: 'Premium Business Card Printing',
    description: 'Professional business cards that make a lasting impression. High-quality printing with various finishes including matte, gloss, and spot UV available at Bureau Graphics',
    price: 'From KES 1,500',
    image: 'https://images.unsplash.com/photo-1759692071978-8bb602bcfe76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNhcmQlMjBwcmludGluZyUyMGRlc2lnbnxlbnwxfHx8fDE3NzQwMDQyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'business-cards',
  },
  {
    id: 3,
    badge: 'Banners',
    title: 'Large Format Banner Printing',
    description: 'Eye-catching banners for events, exhibitions, and promotions. From rollup banners to backdrop displays, we have all your branding needs covered',
    price: 'From KES 3,500',
    image: 'https://images.unsplash.com/photo-1770017863955-56a1501a3c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5uZXIlMjBwcmludGluZyUyMGxhcmdlJTIwZm9ybWF0fGVufDF8fHx8MTc3NDAwNDI1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'banners',
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[500px] md:h-[600px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="grid md:grid-cols-2 gap-8 h-full items-center px-4 sm:px-6 lg:px-8 py-12">
                {/* Left Content */}
                <div className="space-y-6">
                  <div className="inline-block">
                    <span className="bg-pink-100 text-[#EF233C] px-4 py-2 rounded-full text-sm font-medium">
                      {slide.badge}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                    {slide.title}
                  </h1>
                  <p className="text-gray-600 text-lg max-w-xl">
                    {slide.description}
                  </p>
                  <div className="text-3xl font-bold text-[#EF233C]">
                    {slide.price}
                  </div>
                  <div className="flex gap-4">
                    <Link to={`/products/${slide.category}`}>
                      <Button className="bg-[#EF233C] hover:bg-red-700 text-white px-8 py-6">
                        Order Now
                      </Button>
                    </Link>
                    <Link to={`/products/${slide.category}`}>
                      <Button variant="outline" className="border-[#EF233C] text-[#EF233C] hover:bg-red-50 px-8 py-6">
                        View Category
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Image */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative w-full h-[450px] rounded-lg overflow-hidden shadow-2xl">
                    <ImageWithFallback
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    {slide.badge === 'Stickers' && (
                      <div className="absolute bottom-6 right-6 bg-[#EF233C] text-white px-4 py-2 rounded-lg font-medium">
                        Custom Prints
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-900" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-900" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-[#EF233C]'
                    : 'w-2 bg-gray-400 hover:bg-gray-600'
                } h-2 rounded-full`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}