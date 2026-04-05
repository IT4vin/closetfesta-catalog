import { AnimatePresence, motion } from "framer-motion";
import { User, Home, ShoppingBag, Heart, Truck, Bell, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: User, label: "Perfil" },
  { icon: Home, label: "Página Inicial", route: "/" },
  { icon: ShoppingBag, label: "Meu Carrinho" },
  { icon: Heart, label: "Favoritos" },
  { icon: Truck, label: "Meus Pedidos" },
  { icon: Bell, label: "Notificações" },
];

const SideDrawer = ({ open, onClose }: SideDrawerProps) => {
  const navigate = useNavigate();

  const handleNav = (route?: string) => {
    onClose();
    if (route) setTimeout(() => navigate(route), 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 left-0 z-[70] w-[78%] max-w-xs flex flex-col"
            style={{ backgroundColor: "hsl(348, 53%, 40%)" }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-4 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Profile header */}
            <div className="pt-14 pb-8 px-6 flex flex-col items-start">
              <Avatar className="w-16 h-16 border-2 border-white/30">
                <AvatarFallback className="bg-white/20 text-white text-xl font-semibold">
                  AS
                </AvatarFallback>
              </Avatar>
              <p className="text-white/70 text-sm mt-4 font-body">Bem-vinda,</p>
              <p className="text-white text-lg font-display font-semibold">Ana Silva</p>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-white/20" />

            {/* Menu items */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item.route)}
                  className="flex items-center gap-4 w-full px-3 py-3.5 rounded-xl text-white/90 hover:bg-white/10 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-body font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Bottom divider + logout */}
            <div className="px-6">
              <div className="h-px bg-white/20 mb-2" />
            </div>
            <div className="px-4 pb-10">
              <button
                onClick={() => handleNav()}
                className="flex items-center gap-4 w-full px-3 py-3.5 rounded-xl text-white/70 hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-body font-medium">Sair da conta</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
