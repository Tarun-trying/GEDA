import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase profiles table
  const fetchProfile = async (userId) => {
    if (!supabase || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error.message);
      }
      return data || null;
    } catch (err) {
      console.error('Fetch profile exception:', err);
      return null;
    }
  };

  // Fetch completed challenge IDs for current user
  const fetchUserChallenges = async (userId) => {
    if (!supabase || !userId) return [];
    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .select('challenge_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user challenges:', error.message);
        return [];
      }
      return data.map(item => item.challenge_id);
    } catch (err) {
      console.error('Fetch challenges exception:', err);
      return [];
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Check current active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id).then(setProfile);
      }
      setLoading(false);
    });

    // Listen to Auth State changes (LOGIN, LOGOUT, TOKEN_REFRESH)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const userProfile = await fetchProfile(currentUser.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign Up with Email, Password & Meta Data
  const signUp = async ({ email, password, fullName, district }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. Please add your credentials to frontend/.env.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          district: district || 'Ahmedabad'
        }
      }
    });

    if (error) throw error;

    // In case trigger didn't run or needed fallback profile insert
    if (data.user) {
      const existing = await fetchProfile(data.user.id);
      if (!existing) {
        await supabase.from('profiles').insert([
          {
            id: data.user.id,
            full_name: fullName,
            district: district || 'Ahmedabad',
            total_points: 0
          }
        ]);
        const newProf = await fetchProfile(data.user.id);
        setProfile(newProf);
      }
    }

    return data;
  };

  // Sign In with Email & Password
  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. Please add your credentials to frontend/.env.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (data.user) {
      const userProfile = await fetchProfile(data.user.id);
      setProfile(userProfile);
    }
    return data;
  };

  // Sign Out
  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Save Challenge Completion directly to Supabase
  const recordChallengeCompletion = async (challengeId, points) => {
    if (!supabase || !user) return false;
    try {
      const { error } = await supabase
        .from('user_challenges')
        .insert([
          {
            user_id: user.id,
            challenge_id: challengeId,
            points_earned: points
          }
        ]);

      if (error) {
        console.warn('Challenge record error:', error.message);
        return false;
      }

      // Update total points in profile
      const newPoints = (profile?.total_points || 0) + points;
      await supabase
        .from('profiles')
        .update({ total_points: newPoints, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      setProfile(prev => prev ? { ...prev, total_points: newPoints } : null);
      return true;
    } catch (err) {
      console.error('Challenge completion error:', err);
      return false;
    }
  };

  // Save Footprint directly to Supabase
  const recordFootprint = async (monthlyKwh, monthlyBill) => {
    if (!supabase || !user) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          monthly_kwh: monthlyKwh,
          monthly_bill: monthlyBill,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.warn('Footprint update error:', error.message);
        return false;
      }

      setProfile(prev => prev ? { ...prev, monthly_kwh: monthlyKwh, monthly_bill: monthlyBill } : null);
      return true;
    } catch (err) {
      console.error('Footprint update error:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        fetchProfile,
        fetchUserChallenges,
        recordChallengeCompletion,
        recordFootprint
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

