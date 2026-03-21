import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { getProductById } from '../data/products';
import { Bookmark, ChevronDown, ChevronUp, Upload, FileDown } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Calculator imports
import { BusinessCardCalculator } from '../components/calculators/BusinessCardCalculator';
import { BookletCalculator } from '../components/calculators/BookletCalculator';
import { BannerCalculator } from '../components/calculators/BannerCalculator';
import { FlyerCalculator } from '../components/calculators/FlyerCalculator';
import { StickerCalculator } from '../components/calculators/StickerCalculator';
import { TshirtCalculator } from '../components/calculators/TshirtCalculator';
import { PosterCalculator } from '../components/calculators/PosterCalculator';
import { SimpleCalculator } from '../components/calculators/SimpleCalculator';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');

  const [showOverview, setShowOverview] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!product) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/categories" className="text-[#2B59C3] hover:underline mt-4 inline-block">
          Browse all categories
        </Link>
      </div>
    );
  }

  const renderCalculator = () => {
    switch (product.calculatorType) {
      case 'business-cards': return <BusinessCardCalculator product={product} />;
      case 'booklet':        return <BookletCalculator product={product} />;
      case 'banner':         return <BannerCalculator product={product} />;
      case 'flyer':          return <FlyerCalculator product={product} />;
      case 'sticker':        return <StickerCalculator product={product} />;
      case 'tshirt':         return <TshirtCalculator product={product} />;
      case 'poster':         return <PosterCalculator product={product} />;
      default:               return <SimpleCalculator product={product} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left: Image + Overview + FAQ + Upload */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative">
                <button className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors z-10 text-sm">
                  <Bookmark className="h-4 w-4" />
                  Save
                </button>
                <div className="aspect-[4/3] bg-gray-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Overview accordion */}
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowOverview(!showOverview)}
                  className="flex items-center justify-between w-full py-1"
                >
                  <h3 className="font-semibold">Overview</h3>
                  {showOverview ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                {showOverview && (
                  <div className="pt-4 text-gray-600 text-sm leading-relaxed">
                    <p className="mb-3">{product.description}</p>
                    <p>
                      Looking for professional {product.name.toLowerCase()} in Kenya?
                      At Bureau Graphics we offer complete printing solutions for businesses,
                      events, churches, schools, and government institutions across Kenya.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Template Download */}
            {product.templateUrl && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900 text-sm">Download Template</p>
                  <p className="text-blue-700 text-xs mt-0.5">Get our print-ready template file</p>
                </div>
                <a
                  href={product.templateUrl}
                  className="flex items-center gap-2 bg-[#2B59C3] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <FileDown className="h-4 w-4" />
                  Download
                </a>
              </div>
            )}

            {/* File Upload */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-semibold mb-1">Upload Your Artwork</h3>
              <p className="text-gray-500 text-sm mb-4">PDF, AI, PSD, PNG or JPG • Max 100MB</p>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-[#EF233C] hover:bg-red-50 transition-all group">
                <Upload className="h-8 w-8 text-gray-400 group-hover:text-[#EF233C] mb-3 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#EF233C]">Click to upload or drag & drop</span>
                <span className="text-xs text-gray-400 mt-1">Your file will be reviewed by our team</span>
                <input type="file" className="hidden" accept=".pdf,.ai,.psd,.png,.jpg,.jpeg" />
              </label>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Don't have a design?{' '}
                <a href="/graphic-design" className="text-[#2B59C3] hover:underline">
                  Order graphic design →
                </a>
              </p>
            </div>

            {/* FAQ */}
            {product.faq && product.faq.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  {product.faq.map((item, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-sm">{item.q}</span>
                        {openFaq === i
                          ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                          : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                        }
                      </button>
                      {openFaq === i && (
                        <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Need Help */}
            <div className="bg-white rounded-lg shadow-lg p-5">
              <h3 className="font-semibold mb-1">Need help?</h3>
              <p className="text-gray-600 text-sm">
                Call us on{' '}
                <a href="tel:0746174084" className="text-[#EF233C] font-semibold hover:underline">
                  0746 174 084
                </a>{' '}
                — Mon–Sat, 8am to 6pm
              </p>
            </div>
          </div>

          {/* Right: Calculator (varies per product) */}
          <div>
            {renderCalculator()}
          </div>
        </div>
      </div>
    </div>
  );
}
