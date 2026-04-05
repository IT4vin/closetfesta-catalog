import { useState } from "react";
import HomeScreen from "@/components/HomeScreen";
import ProductDetailScreen from "@/components/ProductDetailScreen";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-stretch w-full max-w-[860px]">
        {/* Home Screen */}
        <div className="w-full max-w-[400px] h-[780px] rounded-[2.5rem] overflow-hidden shadow-elevated bg-background border border-border">
          <HomeScreen onSelectProduct={(id) => setSelectedProduct(id)} />
        </div>

        {/* Product Detail Screen */}
        <div className="w-full max-w-[400px] h-[780px] rounded-[2.5rem] overflow-hidden shadow-elevated bg-background border border-border">
          <ProductDetailScreen
            productId={selectedProduct ?? 1}
            onBack={() => setSelectedProduct(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
