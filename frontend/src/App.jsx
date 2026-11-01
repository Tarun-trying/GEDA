import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ResetModal from './components/ResetModal';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import FootprintCalculator from './pages/FootprintCalculator';
import Challenges from './pages/Challenges';
import SolarCalculator from './pages/SolarCalculator';
import CivicDatabase from './pages/CivicDatabase';
import { loadSavedState, saveState, resetState } from './utils/storage';
import { useAuth } from './context/AuthContext';
import { Leaf, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(() => loadSavedState());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { 
    user, 
    profile, 
    fetchUserChallenges, 
    recordChallengeCompletion, 
    recordFootprint 
  } = useAuth();

  // Sync state with Supabase user when signed in
  useEffect(() => {
    if (user && profile) {
      fetchUserChallenges(user.id).then((challenges) => {
        setUserData((prev) => ({
          ...prev,
          totalPoints: typeof profile.total_points === 'number' ? profile.total_points : prev.totalPoints,
          monthlyKwh: profile.monthly_kwh ? Number(profile.monthly_kwh) : prev.monthlyKwh,
          monthlyBill: profile.monthly_bill ? Number(profile.monthly_bill) : prev.monthlyBill,
          completedChallenges: challenges && challenges.length > 0 ? challenges : prev.completedChallenges
        }));
      });
    }
  }, [user, profile]);

  // Sync to localStorage whenever userData changes
  useEffect(() => {
    saveState(userData);
  }, [userData]);

  // Handler: Update Carbon Footprint
  const handleSaveFootprint = ({ monthlyKwh, monthlyBill }) => {
    setUserData((prev) => ({
      ...prev,
      monthlyKwh,
      monthlyBill,
      solarInput: {
        ...prev.solarInput,
        monthlyKwh
      }
    }));

    // If signed into Supabase, save to database
    recordFootprint(monthlyKwh, monthlyBill);
  };

  // Handler: Complete a Green Challenge
  const handleCompleteChallenge = (challengeId, points) => {
    setUserData((prev) => {
      if (prev.completedChallenges.includes(challengeId)) {
        return prev; // prevent duplicate points
      }
      return {
        ...prev,
        totalPoints: prev.totalPoints + points,
        completedChallenges: [...prev.completedChallenges, challengeId]
      };
    });

    // If signed into Supabase, save to database
    recordChallengeCompletion(challengeId, points);
  };

  // Handler: Update Solar Parameters
  const handleSaveSolar = (solarParams) => {
    setUserData((prev) => ({
      ...prev,
      solarInput: {
        ...prev.solarInput,
        ...solarParams
      }
    }));
  };

  // Handler: Reset Demo Data
  const handleConfirmReset = () => {
    const freshDefault = resetState();
    setUserData(freshDefault);
    setIsResetModalOpen(false);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface antialiased">
      {/* 1. Sticky Navigation Header */}
      <Header
        totalPoints={userData.totalPoints}
        activeTab={activeTab}
        onResetClick={() => setIsResetModalOpen(true)}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex w-full">
        {/* 2. Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          completedCount={userData.completedChallenges.length}
          totalChallenges={5}
        />

        {/* 3. Main Content Workbench */}
        <main className="flex-1 w-full md:pl-64 flex flex-col justify-between">
          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {activeTab === 'dashboard' && (
              <Dashboard
                userData={userData}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'footprint' && (
              <FootprintCalculator
                userData={userData}
                onSave={handleSaveFootprint}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'challenges' && (
              <Challenges
                userData={userData}
                onCompleteChallenge={handleCompleteChallenge}
              />
            )}

            {activeTab === 'solar' && (
              <SolarCalculator
                userData={userData}
                onSaveSolar={handleSaveSolar}
              />
            )}

            {activeTab === 'database' && (
              <CivicDatabase
                onNavigate={setActiveTab}
              />
            )}
          </div>

          {/* 4. Footer */}
          <footer className="w-full bg-surface-container-lowest border-t border-surface-container mt-12 py-6 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="font-semibold text-primary">GreenSaathi</span>
                <span>• GEDA Mission LiFE Hackathon Solution</span>
                <span className="font-mono text-[11px] text-gray-400">(HC26-GEDA01)</span>
              </div>

              <div className="text-center sm:text-right text-[11px]">
                Built for Gujarat Energy Development Agency (GEDA) • Client-side localStorage persistence
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* 5. Reset Demonstration State Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {/* 6. Citizen Authentication Modal (Supabase Auth) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
