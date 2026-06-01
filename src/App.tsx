import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RouteFallback from "@/components/RouteFallback";
import { CartProvider } from "@/contexts/CartContext";
import { SearchProvider } from "@/contexts/SearchContext";

const Index = lazy(() => import("./pages/Index.tsx"));
const ProductPage = lazy(() => import("./pages/ProductPage.tsx"));
const CartPage = lazy(() => import("./pages/CartPage.tsx"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const OrdersPage = lazy(() => import("./pages/OrdersPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SearchProvider>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/produto/:slug" element={<ProductPage />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/favoritos" element={<FavoritesPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/pedidos" element={<OrdersPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SearchProvider>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
