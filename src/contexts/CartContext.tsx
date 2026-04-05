import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  productId: number;
  size: string;
  color: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (idx: number, delta: number) => void;
  removeItem: (idx: number) => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
      );
      if (idx >= 0) {
        return prev.map((i, j) => (j === idx ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...item, qty }];
    });
  };

  const updateQty = (idx: number, delta: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};
