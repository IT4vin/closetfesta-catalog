import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, CreditCard, Bell, HelpCircle, Shield, ChevronRight, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ClosetSearchBar from "@/components/ClosetSearchBar";

const menuSections = [
  {
    title: "Minha Conta",
    items: [
      { icon: User, label: "Dados Pessoais", desc: "Nome, e-mail, telefone" },
      { icon: MapPin, label: "Endereços", desc: "Retirada e devolução do aluguel" },
      { icon: CreditCard, label: "Pagamento", desc: "Cartões salvos" },
    ],
  },
  {
    title: "Preferências",
    items: [
      { icon: Bell, label: "Notificações", desc: "Alertas e promoções" },
      { icon: Shield, label: "Privacidade", desc: "Dados e segurança" },
      { icon: HelpCircle, label: "Ajuda", desc: "FAQ e suporte" },
    ],
  },
];

const ProfileScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col bg-background pb-24">
      {/* Header */}
      <div className="flex items-center px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-card">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center font-display text-lg font-bold text-foreground pr-10">Perfil</h1>
      </div>

      <div className="px-5 pb-2">
        <ClosetSearchBar />
      </div>

      {/* Avatar Card */}
      <div className="mx-5 p-5 rounded-2xl bg-primary shadow-elevated">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-lg font-bold text-white">Nome do usuário</p>
            <p className="font-body text-sm text-white/70 truncate">@usuario.email.com</p>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-body font-semibold">
            Editar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mx-5 mt-4">
        {[
          { value: "0", label: "Aluguéis" },
          { value: "0", label: "Favoritos" },
          { value: "0", label: "Cupons" },
        ].map((s) => (
          <div key={s.label} className="bg-secondary/60 rounded-2xl p-4 text-center shadow-card">
            <p className="font-display text-xl font-bold text-primary">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu Sections */}
      <div className="px-5 mt-5 space-y-5 pb-10">
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="font-display text-sm font-semibold text-foreground mb-2">{section.title}</p>
            <div className="bg-secondary/60 rounded-2xl shadow-card overflow-hidden divide-y divide-border/50">
              {section.items.map((item) => (
                <button key={item.label} className="flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-secondary transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-destructive/5 shadow-card hover:bg-destructive/10 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-destructive" />
          </div>
          <span className="font-body text-sm font-semibold text-destructive">Sair da conta</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfileScreen;
