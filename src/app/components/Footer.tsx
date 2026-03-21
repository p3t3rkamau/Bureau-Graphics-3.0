import { Link } from 'react-router';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Section */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Button className="bg-[#EF233C] hover:bg-red-700 text-white px-8 py-3">
            Get My 10% Discount
          </Button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="text-xl font-bold mb-4">
                <span className="text-[#2B59C3]">Bureau</span>
                <span className="text-[#EF233C]">Graphics</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Kenya's trusted online print shop. Professional quality, fast turnaround, nationwide delivery.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <a href="tel:0746174084" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Phone className="h-4 w-4" />
                0746174084
              </a>
              <a href="mailto:orders@bureaugraphics.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4" />
                orders@bureaugraphics.com
              </a>
              <p className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                Wilson, Nairobi
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/services/same-day" className="hover:text-white transition-colors">Same-Day Printing</Link></li>
              <li><Link to="/services/design" className="hover:text-white transition-colors">Design Assistance</Link></li>
              <li><Link to="/services/bulk" className="hover:text-white transition-colors">Bulk Order Discounts</Link></li>
              <li><Link to="/services/branding" className="hover:text-white transition-colors">Corporate Branding</Link></li>
              <li><Link to="/services/election" className="hover:text-white transition-colors">Election Materials</Link></li>
            </ul>
          </div>

          {/* Delivery & Pricing */}
          <div>
            <h3 className="font-semibold mb-4">Delivery & Pricing</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/delivery/nairobi" className="hover:text-white transition-colors">Nairobi: KES 450</Link></li>
              <li><Link to="/delivery/outside" className="hover:text-white transition-colors">Outside Nairobi: KES 850</Link></li>
              <li><Link to="/delivery/free" className="hover:text-white transition-colors">Free above KES 10,000</Link></li>
              <li><Link to="/delivery/express" className="hover:text-white transition-colors">Express & Rush Options</Link></li>
              <li><Link to="/delivery/counties" className="hover:text-white transition-colors">All 47 Counties</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Our Blog</Link></li>
              <li><Link to="/reviews" className="hover:text-white transition-colors">Customer Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Shop All Products</Link></li>
            </ul>
          </div>

          {/* Legal & Account */}
          <div>
            <h3 className="font-semibold mb-4">Legal & Account</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link to="/subscription" className="hover:text-white transition-colors">Subscription Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/checkout" className="hover:text-white transition-colors">Checkout</Link></li>
            </ul>
          </div>
        </div>

        {/* Product Categories Grid */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="font-semibold mb-6">Our Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div>
              <h4 className="text-[#EF233C] font-medium mb-3">Banners</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/products/banners/table-rollup" className="hover:text-white">Table Rollup Printing</Link></li>
                <li><Link to="/products/banners/backdrop" className="hover:text-white">Adjustable Backdrop</Link></li>
                <li><Link to="/products/banners/table-cloth" className="hover:text-white">Table Cloth Printing</Link></li>
                <li><Link to="/products/banners/s-banner" className="hover:text-white">S-Banner Printing</Link></li>
                <li><Link to="/products/banners/pvc-wheel" className="hover:text-white">PVC Wheel Cover</Link></li>
                <li><Link to="/products/banners" className="text-[#EF233C] hover:underline">View all →</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#EF233C] font-medium mb-3">Booklet Magazines</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/products/booklet/funeral" className="hover:text-white">Funeral Programs</Link></li>
                <li><Link to="/products/booklet/magazines" className="hover:text-white">Booklet Magazines</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#EF233C] font-medium mb-3">Branded Apparel</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/products/apparel/reflector-jackets" className="hover:text-white">Reflector Jackets</Link></li>
                <li><Link to="/products/apparel/aprons" className="hover:text-white">Branded Aprons</Link></li>
                <li><Link to="/products/apparel/tshirt" className="hover:text-white">Branded T-shirt</Link></li>
                <li><Link to="/products/apparel/hoodies" className="hover:text-white">Branded Hoodies</Link></li>
                <li><Link to="/products/apparel/jerseys" className="hover:text-white">Branded Jerseys for clubs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#EF233C] font-medium mb-3">Business Cards</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/products/business-cards/spot-uv" className="hover:text-white">Spot UV Business Cards</Link></li>
                <li><Link to="/products/business-cards/bookmarks" className="hover:text-white">Bookmarks printing</Link></li>
                <li><Link to="/products/business-cards/postcards" className="hover:text-white">Postcards printing</Link></li>
                <li><Link to="/products/business-cards/standard" className="hover:text-white">Business Cards Printing</Link></li>
                <li><Link to="/products/business-cards/gift-voucher" className="hover:text-white">Gift Voucher Printing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#EF233C] font-medium mb-3">Digital printing</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/products/digital/document" className="hover:text-white">Document Printing</Link></li>
                <li><Link to="/products/digital/business-cards" className="hover:text-white">Business Cards Printing</Link></li>
                <li><Link to="/products/digital/gift-voucher" className="hover:text-white">Gift Voucher Printing</Link></li>
                <li><Link to="/products/digital/photo" className="hover:text-white">Photo Printing Services</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#EF233C] font-medium mb-3">Election Printing</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/products/election/button-badges" className="hover:text-white">Button Badges Printing</Link></li>
                <li><Link to="/products/election/posters" className="hover:text-white">Posters printing</Link></li>
                <li><Link to="/products/election/flyers" className="hover:text-white">Flyers printing</Link></li>
                <li><Link to="/products/election/nametags" className="hover:text-white">Nametags</Link></li>
                <li><Link to="/products/election/selfie-frames" className="hover:text-white">Selfie Frames</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#EF233C] font-medium mb-3">Events Display</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/products/events/button-badges" className="hover:text-white">Button Badges Printing</Link></li>
                <li><Link to="/products/events/table-rollup" className="hover:text-white">Table Rollup Printing</Link></li>
                <li><Link to="/products/events/backdrop" className="hover:text-white">Adjustable Backdrop</Link></li>
                <li><Link to="/products/events/table-cloth" className="hover:text-white">Table Cloth Printing</Link></li>
                <li><Link to="/products/events/kitenge" className="hover:text-white">Kitenge Notebooks</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#EF233C] font-medium mb-3">Flyers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/products/flyers/printing" className="hover:text-white">Flyers printing</Link></li>
                <li><Link to="/products/flyers/brochures" className="hover:text-white">Brochures Printing</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Browse All Categories */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="font-semibold mb-4">Browse All Categories</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/categories/graphic-design" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">Graphic Design</Link>
            <Link to="/categories/mug-printing" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">Mug Printing &amp; Branded Drinkware</Link>
            <Link to="/categories/packaging" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">Packaging</Link>
            <Link to="/categories/photo-printing" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">Photo Printing and Framing</Link>
            <Link to="/categories/posters" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">Posters</Link>
            <Link to="/categories/promotional" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">Promotional Items</Link>
            <Link to="/categories/signages" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">Signages</Link>
            <Link to="/categories/stationary" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">Stationary</Link>
            <Link to="/categories/stickers" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">Stickers</Link>
            <Link to="/categories/t-shirts" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">T-shirts</Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
            Shop Now
          </Button>
          <Button className="bg-black hover:bg-gray-800">
            Business Packages
          </Button>
          <Button className="bg-black hover:bg-gray-800">
            Election Printing
          </Button>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
            Get a Quote
          </Button>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
            Track Order
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p className="mb-2">© 2026 Bureau Graphics. All rights reserved.</p>
          <p className="flex items-center justify-center gap-2">
            <span>M-Pesa • Visa • Mastercard</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
