import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-navy-dark to-navy border-b border-navy-light z-50 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-white hover:text-accent hover:bg-black/20 border border-navy-light"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold text-white">System Monitorowania Produkcji</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-200">Administrator</span>
            <div className="flex items-center space-x-2 bg-black/20 px-3 py-1 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" title="Połączenie aktywne"></div>
              <span className="text-xs text-green-300">ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main 
        className={`pt-16 min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72' : ''
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}