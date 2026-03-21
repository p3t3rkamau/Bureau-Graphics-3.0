import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const handleClick = () => {
    // Bureau Graphics WhatsApp number
    const phoneNumber = '254746174084'; // Format: country code + number without +
    const message = encodeURIComponent('Hello! I would like to inquire about your printing services.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline pr-2">Order via WhatsApp</span>
    </button>
  );
}
