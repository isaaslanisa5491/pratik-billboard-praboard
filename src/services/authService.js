import { supabase } from '../config/supabase';

/**
 * Yeni kullanıcı kaydı
 * Supabase Auth + trigger ile otomatik profiles satırı oluşur
 */
export async function signUp({ email, password, fullName, phone }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone },
      emailRedirectTo: 'https://pratik-billboard-praboard.vercel.app/',
    },
  });
  if (error) throw error;
  return data;
}

/**
 * E-posta + şifre ile giriş
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Çıkış yap
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Şifre sıfırlama e-postası gönder
 * redirectTo: Kullanıcı e-postadaki linke tıklayınca bu URL'e yönlendirilir
 */
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://pratik-billboard-praboard.vercel.app/?type=recovery',
  });
  if (error) throw error;
}

/**
 * Yeni şifre belirle (kullanıcı giriş yapmış olmalı)
 */
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

/**
 * Mevcut oturum bilgisini getir
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Auth durumu değişikliklerini dinle
 * @returns {function} unsubscribe fonksiyonu
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(session, event);
    }
  );
  return () => subscription.unsubscribe();
}
