import { createBrowserRouter } from "react-router";
import { Root } from "./layouts/Root";
import { Home } from "./pages/Home";
import { Categories } from "./pages/Categories";
import { ProductList } from "./pages/ProductList";
import { ProductDetail } from "./pages/ProductDetail";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { SearchResults } from "./pages/SearchResults";
import { CartPage } from "./pages/cartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { BusinessPackages } from "./pages/BusinessPackages.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,                      Component: Home },
      { path: "categories",               Component: Categories },
      { path: "products/:category",       Component: ProductList },
      { path: "product/:id",              Component: ProductDetail },
      { path: "contact",                  Component: Contact },
      { path: "search",                   Component: SearchResults },
      { path: "cart",                     Component: CartPage },
      { path: "checkout",                 Component: CheckoutPage },
      { path: "business-packages",        Component: BusinessPackages },
      { path: "*",                        Component: NotFound },
    ],
  },
]);