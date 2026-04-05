import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Truck, CheckCircle2, Clock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { products } from "@/data/products";

const orders = [
  {
    id: "CF-2026-0412",
    date: "28 Mar 2026",
    status: "delivered" as const,
    items: [{ productId: 1, size: "M", qty: 1 }],
    total: 1490,
  },
  {
    id: "CF-2026-0389",
    date: "15 Mar 2026",
    status: "shipping" as const,
    items: [
      { productId: 2, size: "G", qty: 1 },
      { productId: 4, size: "M", qty: 1 },
    ],
    total: 6580,
  },
  {
    id: "CF-2026-0301",
    date: "02 Fev 2026",
    status: "delivered" as const,
    items: [{ productId: 3, size: "P", qty: 2 }],
    total: 5780,
  },
  {
    id: "CF-2026-0256",
    date: "10 Jan 2026",
    status: "processing" as const,
    items: [{ productId: 5, size: "G", qty: 1 }],
    total: 1290,
  },
];

const statusConfig = {
  delivered: { label: "Entregue", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  shipping: { label: "A caminho", icon: Truck, color: "text-primary bg-primary/10" },
  processing: { label: "Processando", icon: Clock, color: "text-amber-600 bg-amber-50" },
};

const OrdersScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col bg-background pb-24">
      {/* Header */}
      <div className="flex items-center px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-card">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center font-display text-lg font-bold text-foreground pr-10">Meus Pedidos</h1>
      </div>

      {/* Orders */}
      <div className="px-5 space-y-4 pb-8">
        {orders.map((order) => {
          const cfg = statusConfig[order.status];
          const StatusIcon = cfg.icon;
          return (
            <div key={order.id} className="rounded-2xl bg-secondary/60 shadow-card overflow-hidden">
              {/* Order header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div>
                  <p className="font-display text-sm font-bold text-foreground">{order.id}</p>
                  <p className="font-body text-xs text-muted-foreground">{order.date}</p>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-semibold ${cfg.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {cfg.label}
                </span>
              </div>

              {/* Items */}
              <div className="px-4 py-2 space-y-2">
                {order.items.map((item, idx) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-12 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-semibold text-foreground truncate">{product.name}</p>
                        <p className="font-body text-xs text-muted-foreground">Tam. {item.size} · Qtd. {item.qty}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/40">
                <p className="font-body text-xs text-muted-foreground">
                  Total: <span className="font-display font-bold text-primary text-sm">R$ {order.total.toLocaleString("pt-BR")}</span>
                </p>
                <button className="flex items-center gap-1 text-xs font-body font-semibold text-primary">
                  Detalhes <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default OrdersScreen;
