import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const { isAuthenticated, hasUsername, loading, isPasswordRecovery, isEmailVerified } = useAuth();
  const [stack, setStack] = useState([{ name: 'Loading', params: {} }]);

  // Auth durumuna göre başlangıç ekranını belirle
  useEffect(() => {
    if (loading) return; // Henüz yükleniyor, bekle

    if (isPasswordRecovery) {
      // Şifre sıfırlama linkinden geldi → Yeni şifre ekranı
      setStack([{ name: 'ResetPassword', params: {} }]);
    } else if (isEmailVerified && isAuthenticated) {
      // Email doğrulama linkinden geldi → Karşılama sayfası
      setStack([{ name: 'EmailVerified', params: {} }]);
    } else if (!isAuthenticated) {
      // Giriş yapılmamış → Web: Landing, Mobil: Onboarding
      const initial = Platform.OS === 'web' ? 'Landing' : 'Onboarding';
      setStack([{ name: initial, params: {} }]);
    } else if (!hasUsername) {
      // Giriş yapılmış ama username yok → Username seç
      setStack([{ name: 'UsernameSelect', params: {} }]);
    } else {
      // Tam giriş → Ana sayfa
      setStack([{ name: 'HomeTab', params: {} }]);
    }
  }, [isAuthenticated, hasUsername, loading, isPasswordRecovery, isEmailVerified]);

  const navigate = useCallback((name, params = {}) => {
    setStack((prev) => [...prev, { name, params }]);
  }, []);

  const replace = useCallback((name, params = {}) => {
    setStack((prev) => {
      const newStack = prev.length > 1 ? prev.slice(0, -1) : [];
      return [...newStack, { name, params }];
    });
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const reset = useCallback((name, params = {}) => {
    setStack([{ name, params }]);
  }, []);

  const currentRoute = stack[stack.length - 1];

  const navigation = {
    navigate,
    replace,
    goBack,
    reset,
    currentRoute,
  };

  return (
    <NavigationContext.Provider value={navigation}>
      {typeof children === 'function' ? children(navigation) : children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const nav = useContext(NavigationContext);
  if (!nav) throw new Error('useNavigation must be used within NavigationProvider');
  return nav;
}
