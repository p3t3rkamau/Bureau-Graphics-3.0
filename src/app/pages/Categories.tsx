import { Link } from 'react-router';
import { categories } from '../data/products';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const categoryImages: Record<string, string> = {
  'banners': 'https://images.unsplash.com/photo-1635713044894-af06f4056804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwYmFubmVyJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzc0MDA0Mjk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'booklet-magazines': 'https://images.unsplash.com/photo-1661523892046-c7ae3b169e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rbGV0JTIwbWFnYXppbmUlMjBwcmludGluZ3xlbnwxfHx8fDE3NzQwMDQyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'branded-apparel': 'https://images.unsplash.com/photo-1678872844677-d650b788709b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGVkJTIwdHNoaXJ0JTIwY29sb3JmdWx8ZW58MXx8fHwxNzc0MDA0MzA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'business-cards': 'https://images.unsplash.com/photo-1561015314-6bd8c1e875ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNhcmRzJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzczOTM5MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'digital-printing': 'https://images.unsplash.com/photo-1773525912431-ee1eff5e1ab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcHJpbnRpbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc3NDAwNDI5NXww&ixlib=rb-4.1.0&q=80&w=1080',
  'election-printing': 'https://images.unsplash.com/photo-1631540697693-a98f1752f16a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdGlvbiUyMGNhbXBhaWduJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzc0MDA0Mjk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'events-display': 'https://images.unsplash.com/photo-1773864931268-95c4548260da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMGRpc3BsYXklMjBzdGFuZHN8ZW58MXx8fHwxNzc0MDA0Mjk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'flyers': 'https://images.unsplash.com/photo-1630327722923-5ebd594ddda9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHllciUyMHByaW50aW5nJTIwc2VydmljZXxlbnwxfHx8fDE3NzQwMDQyOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'graphic-design': 'https://images.unsplash.com/photo-1587089879249-87bf7d2972df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwc2VydmljZXxlbnwxfHx8fDE3NzQwMDQyOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'mug-drinkware': 'https://images.unsplash.com/photo-1770650554223-2184f49f71a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGVkJTIwbXVnJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzc0MDA0Mjk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'packaging': 'https://images.unsplash.com/photo-1548471413-17f522202ddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGFja2FnaW5nJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzc0MDA0Mjk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'photo-printing': 'https://images.unsplash.com/photo-1618691490633-5e1b5265428c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90byUyMHByaW50aW5nJTIwZnJhbWluZ3xlbnwxfHx8fDE3NzQwMDQyOTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'posters': 'https://images.unsplash.com/photo-1735665114740-b1fe03b51b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3N0ZXIlMjBwcmludGluZyUyMHNlcnZpY2V8ZW58MXx8fHwxNzc0MDA0Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'promotional-items': 'https://images.unsplash.com/photo-1595142545813-06fee27f3dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9tb3Rpb25hbCUyMGl0ZW1zJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzc0MDA0Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'signages': 'https://images.unsplash.com/photo-1759692071978-8bb602bcfe76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduYWdlJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzc0MDA0Mjk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'stationary': 'https://images.unsplash.com/photo-1630327722923-5ebd594ddda9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGF0aW9uYXJ5JTIwcHJpbnRpbmd8ZW58MXx8fHwxNzc0MDA0Mjk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'stickers': 'https://images.unsplash.com/photo-1617912760717-06f3976cf18c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGlja2VyJTIwcHJpbnRpbmclMjByb2xsc3xlbnwxfHx8fDE3NzQwMDQyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  't-shirts': 'https://images.unsplash.com/photo-1678872844677-d650b788709b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGVkJTIwdHNoaXJ0JTIwY29sb3JmdWx8ZW58MXx8fHwxNzc0MDA0MzA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
};

export function Categories() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Print by Category</h1>
          <p className="text-gray-600 text-lg">Professional printing services delivered across Kenya</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products/${category.id}`}
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden mb-4 ring-4 ring-gray-200 group-hover:ring-[#2B59C3] transition-all shadow-lg">
                <ImageWithFallback
                  src={categoryImages[category.id]}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-center font-medium group-hover:text-[#2B59C3] transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
