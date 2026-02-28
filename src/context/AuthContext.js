import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import { initialAuthType } from '../config/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Supabase auth user
  const [profile, setProfile] = useState(null);  // profiles tablosu
  const [loading, setLoading] = useState(true);  // ilk yükleme
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Profili çek
  const fetchProfile = useCallback(async (userId) => {
    try {
      const p = await userService.getProfile(userId);
      setProfile(p);
      return p;
    } catch {
      setProfile(null);
      return null;
    }
  }, []);

  // Auth durumu dinle
  useEffect(() => {
    let mounted = true;

    // İlk yükleme: mevcut session kontrol
    authService.getCurrentSession().then((session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    // Auth değişikliklerini dinle
    const unsubscribe = authService.onAuthStateChange((session, event) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
        setUser(session.user);
        return;
      }
      if (event === 'SIGNED_IN' && initialAuthType === 'signup') {
        // Email doğrulama linkinden geldi
        setIsEmailVerified(true);
      }
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [fetchProfile]);

  // Kayıt ol
  const signUp = useCallback(async ({ email, password, fullName, phone }) => {
    const data = await authService.signUp({ email, password, fullName, phone });
    // Trigger otomatik profil oluşturur, user state onAuthStateChange ile güncellenir
    return data;
  }, []);

  // Giriş yap
  const signIn = useCallback(async ({ email, password }) => {
    const data = await authService.signIn({ email, password });
    return data;
  }, []);

  // Çıkış yap
  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  // Şifre sıfırlama
  const resetPassword = useCallback(async (email) => {
    await authService.resetPassword(email);
  }, []);

  // Profil güncelle
  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    const updated = await userService.updateProfile(user.id, updates);
    setProfile(updated);
    return updated;
  }, [user]);

  // Username kaydet
  const setUsername = useCallback(async (username) => {
    if (!user) return;
    const updated = await userService.setUsername(user.id, username);
    setProfile(updated);
    return updated;
  }, [user]);

  // Yeni şifre belirle (recovery sonrası)
  const updatePassword = useCallback(async (newPassword) => {
    await authService.updatePassword(newPassword);
    setIsPasswordRecovery(false);
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  // Profili yeniden yükle
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchProfile(user.id);
  }, [user, fetchProfile]);

  // Email doğrulama sayfasını temizle (karşılama sayfasından çıkarken)
  const clearEmailVerified = useCallback(() => {
    setIsEmailVerified(false);
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    hasUsername: !!profile?.username,
    isAdmin: profile?.role === 'admin',
    isPasswordRecovery,
    isEmailVerified,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    setUsername,
    refreshProfile,
    clearEmailVerified,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
