import React from 'react';
import { Home, Calendar, Package, Settings, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onAddClick }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendario' },
    { id: 'products', icon: Package, label: 'Prodotti' },
    { id: 'settings', icon: Settings, label: 'Impostazioni' },
  ];

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-stone-50">
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 safe-area-bottom z-50">
        <div className="max-w-md mx-auto flex justify-around items-center px-4 h-16 relative">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-stone-400'
                }`}
              >
                <Icon size={24} />
                <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
              </button>
            );
          })}
          {activeTab === 'home' && (
            <button
              onClick={onAddClick}
              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
            >
              <Plus size={24} />
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};
export default Layout;