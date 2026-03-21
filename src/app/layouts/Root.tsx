import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { CartProvider } from '../../context/CartContext';
import { CartDrawer } from '../components/cart/CartDrawer';

export function Root() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}