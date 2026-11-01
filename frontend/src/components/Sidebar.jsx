import React from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  Award, 
  Sun, 
  CheckCircle,
  HelpCircle,
  Leaf,
  Database
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isMobileOpen, 
  setIsMobileOpen,
  completedCount = 0,
  totalChallenges = 5
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      desc: 'Overview & Carbon Metrics'
    },
    {
      id: 'footprint',
      label: 'Footprint Calculator',
      icon: Calculator,
      desc: 'Calculate Emissions (kWh)'
    },
    {
      id: 'challenges',
      label: 'Green Challenges',
      icon: Award,
      badge: `${completedCount}/${totalChallenges}`,
      desc: 'Earn Mission LiFE Points'
    },
    {
      id: 'solar',
      label: 'Solar Calculator',
      icon: Sun,
      desc: 'Rooftop Solar & Payback'
    },
    {
      id: 'database',
      label: 'Civic Database',
      icon: Database,
      badge: 'Live',
      desc: 'Smart Bills & Benchmarks'
    }
  ];

  const handleSelect = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
        />
      )}

      {/* Navigation Container (Desktop Sidebar + Mobile Drawer) */}
      <aside className={`
        fixed top-16 md:top-24 bottom-0 left-0 z-35
        w-64 bg-surface-container-lowest border-r border-surface-container
        flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out
        ${isMobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Navigation Links */}
        <div className="flex flex-col gap-1.5">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left
                  transition-all duration-150 group
                  ${isActive 
                    ? 'bg-primary-container text-white font-semibold shadow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-medium'}
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-fixed' : 'text-primary-container/80 group-hover:text-primary'}`} />
                  <div className="flex flex-col truncate">
                    <span className="text-sm leading-tight">{item.label}</span>
                    <span className={`text-[11px] truncate ${isActive ? 'text-primary-fixed/80' : 'text-on-surface-variant/70'}`}>
                      {item.desc}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Sidebar Box: Mission LiFE Civic Card */}
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container rounded-xl p-3.5 border border-surface-container-high/80">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1 rounded-md bg-emerald-600 text-white">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-primary">Mission LiFE Civic Duty</span>
          </div>

          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Every 1 kWh conserved in Gujarat eliminates ~0.70 kg of carbon emissions from entering our atmosphere.
          </p>

          <div className="mt-3 pt-2.5 border-t border-surface-container-high flex items-center justify-between text-[11px]">
            <span className="text-on-surface-variant">Challenges Completed:</span>
            <span className="font-bold text-emerald-700">{completedCount} of {totalChallenges}</span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.round((completedCount / totalChallenges) * 100)}%` }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
