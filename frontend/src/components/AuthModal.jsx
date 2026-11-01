import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GUJARAT_DISTRICTS = [
  'Ahmedabad',
  'Surat',
  'Vadodara',
  'Rajkot',
  'Gandhinagar',
  'Bhavnagar',
  'Jamnagar',
  'Junagadh',
  'Kutch',
  'Anand',
  'Bharuch',
  'Mehsana',
  'Morbi',
  'Navsari',
  'Patan',
  'Porbandar',
  'Sabarkantha',
  'Valsad'
];

export default function AuthModal({ isOpen, onClose }) {
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState('Ahmedabad');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full name.');
          setIsLoading(false);
          return;
        }

        await signUp({
          email,
          password,
          fullName: fullName.trim(),
          district
        });

        setSuccessMessage('Registration successful! You are now signed in to GreenSaathi.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        await signIn({
          email,
          password
        });

        setSuccessMessage('Welcome back! Signed in successfully.');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-primary to-primary-container px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              {mode === 'signin' ? <LogIn className="w-5 h-5 text-emerald-300" /> : <UserPlus className="w-5 h-5 text-emerald-300" />}
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg leading-tight">
                {mode === 'signin' ? 'Sign In to GreenSaathi' : 'Register New Citizen'}
              </h3>
              <p className="text-xs text-primary-fixed-dim">
                {mode === 'signin' 
                  ? 'Access your saved energy milestones & points' 
                  : 'Join Mission LiFE & earn citizen badges'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supabase Not Configured Warning Banner */}
        {!isConfigured && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Supabase credentials needed</span>
              <p className="text-[11px] text-amber-800">
                To connect your live database, add your <code className="bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> in <code className="bg-amber-100 px-1 py-0.5 rounded">frontend/.env</code>.
              </p>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-surface-container text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'signin'
                ? 'border-primary text-primary font-bold bg-surface-container-low/50'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-primary text-primary font-bold bg-surface-container-low/50'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Registration specific fields */}
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-surface-container bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  District (Gujarat)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-surface-container bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface"
                  >
                    {GUJARAT_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Common Email Field */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-surface-container bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface"
              />
            </div>
          </div>

          {/* Common Password Field */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-surface-container bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface"
              />
            </div>
            {mode === 'signup' && (
              <span className="text-[10px] text-on-surface-variant mt-1 block">
                Must be at least 6 characters.
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="bg-surface-container-low px-6 py-3 border-t border-surface-container text-center">
          <p className="text-[11px] text-on-surface-variant">
            Secured by Supabase Authentication & PostgreSQL Database
          </p>
        </div>
      </div>
    </div>
  );
}

