import { useNavigate, useLocation } from "react-router-dom";
import { User, Home, ShoppingBag, Heart, Truck, Bell, LogOut, X } from "lucide-react";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: User, label: "Perfil", path: "/perfil" },
  { icon: Home, label: "Página Inicial", path: "/" },
  { icon: ShoppingBag, label: "Meu Carrinho", path: "/carrinho" },
  { icon: Heart, label: "Favoritos", path: "/favoritos" },
  { icon: Truck, label: "Meus Pedidos", path: "/pedidos" },
  { icon: Bell, label: "Notificações", path: "/notificacoes" },
];

const SideDrawer = ({ open, onClose }: SideDrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    onClose();
    setTimeout(() => navigate(path), 300);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[78%] max-w-xs flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: "hsl(var(--primary))" }}
      >
        <button onClick={onClose} className="absolute top-5 right-4 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </button>
        <div className="pt-14 px-6 pb-8">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-white/70 text-sm font-body">Bem-vinda,</p>
          <p className="text-white text-xl font-display font-bold">Ana Silva</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-left transition-colors ${
                  active ? "bg-white/20 text-white font-semibold" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-body text-[15px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="px-6 pb-10">
          <div className="border-t border-white/20 mb-4" />
          <button onClick={onClose} className="flex items-center gap-4 text-white/70 hover:text-white transition-colors px-2 py-2">
            <LogOut className="w-5 h-5" />
            <span className="font-body text-[15px]">Sair da conta</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
