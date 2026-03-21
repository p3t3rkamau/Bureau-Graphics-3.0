import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

export function Contact() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">Get in touch with Bureau Graphics</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">Name</label>
                <Input type="text" placeholder="Your name" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <Input type="email" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Phone</label>
                <Input type="tel" placeholder="0700 000 000" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Message</label>
                <Textarea rows={5} placeholder="Tell us about your printing needs..." />
              </div>
              <Button className="w-full bg-[#EF233C] hover:bg-red-700 text-white py-6">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#2B59C3] text-white p-3 rounded-lg">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600">0746174084</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#2B59C3] text-white p-3 rounded-lg">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">orders@bureaugraphics.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#2B59C3] text-white p-3 rounded-lg">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-gray-600">Wilson, Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#2B59C3] text-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
