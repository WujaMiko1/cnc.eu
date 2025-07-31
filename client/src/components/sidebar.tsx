import { 
  BarChart3,
  FileText,
  Download,
  History,
  Gauge,
  Activity,
  Settings
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    name: "Dzienny Przegląd Pracy",
    href: "/",
    icon: BarChart3,
  },
  {
    name: "Monitorowanie Maszyn",
    href: "/maszyny",
    icon: Activity,
  },
  {
    name: "Monitoring Programów",
    href: "/programy",
    icon: History,
  },
  {
    name: "Eksport CSV",
    href: "/eksport",
    icon: Download,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 h-full w-72 bg-gradient-to-b from-card to-navy-dark border-r border-navy-light transform transition-transform duration-300 ease-in-out z-40 sidebar-transition shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <nav className="p-6">
        <div className="mb-8 border-b border-navy-light pb-4">
          <h2 className="text-lg font-bold text-white mb-2">System Monitorowania</h2>
          <p className="text-sm text-blue-200">Kontrola i analiza produkcji</p>
        </div>
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group border",
                    isActive
                      ? "bg-accent text-white font-semibold shadow-lg border-accent"
                      : "hover:bg-navy-light hover:text-white text-blue-200 border-transparent hover:border-navy-light"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : "text-blue-300 group-hover:text-white"
                  )} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
