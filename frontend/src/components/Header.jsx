import React, { useState } from 'react';
import { 
  Leaf, 
  Zap, 
  RotateCcw, 
  Menu, 
  X, 
  ShieldCheck, 
  Globe,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { TIERS } from '../data/config';
import { useAuth } from '../context/AuthContext';

export default function Header({ 
  totalPoints, 
  activeTab, 
  onResetClick, 
  onMenuToggle, 
  isMobileMenuOpen,
  onOpenAuth
}) {
  const [lang, setLang] = useState('en');
  const { user, profile, signOut } = useAuth();

  // Determine current citizen tier based on points
  const currentTier = [...TIERS].reverse().find(t => totalPoints >= t.minPoints) || TIERS[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container shadow-sm">
      {/* Top Administrative Ribbon - GEDA & Mission LiFE */}
      <div className="bg-surface-container-low px-4 sm:px-6 py-1 border-b border-surface-container/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-on-surface-variant font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
            <span className="hidden sm:inline">Government of Gujarat |</span>
            <span className="font-semibold text-primary">GEDA Mission LiFE</span>
            <span className="hidden md:inline text-gray-400">• Problem Statement HC26-GEDA01</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-xs text-on-surface">
              <Globe className="w-3 h-3 text-primary-container" />
              <button 
                type="button"
                onClick={() => setLang('en')}
                className={`transition-colors ${lang === 'en' ? 'font-bold text-primary underline' : 'hover:text-primary'}`}
              >
                English
              </button>
              <span className="opacity-40">|</span>
              <button 
                type="button"
                onClick={() => setLang('gu')}
                className={`transition-colors ${lang === 'gu' ? 'font-bold text-primary underline' : 'hover:text-primary'}`}
              >
                ગુજરાતી
              </button>
            </div>

            <button
              onClick={onResetClick}
              title="Reset demonstration state back to original values"
              className="flex items-center gap-1 px-2 py-0.5 text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white shadow-sm">
              <Leaf className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-bold text-xl text-primary tracking-tight">GreenSaathi</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  MVP
                </span>
              </div>
              <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider hidden sm:block">
                Mission LiFE Civic Energy Platform
              </span>
            </div>
          </div>
        </div>

        {/* Right: Citizen Level & Points Indicator + Auth Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 pl-2.5 py-1 pr-3.5 rounded-full bg-surface-container-low border border-surface-container shadow-xs">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              {currentTier.badge}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface leading-tight flex items-center gap-1">
                {currentTier.name.split(' ')[0]}
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-container leading-none">
                <Zap className="w-3 h-3 text-secondary-container fill-secondary-container" />
                {totalPoints} Green Points
              </span>
            </div>
          </div>

          {/* User Authentication Status */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-surface-container">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-on-surface leading-none">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-on-surface-variant leading-none mt-0.5">
                  {profile?.district || 'Citizen'}
                </span>
              </div>
              <button
                type="button"
                onClick={signOut}
                title="Sign out of account"
                className="p-2 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-surface-container/60"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
