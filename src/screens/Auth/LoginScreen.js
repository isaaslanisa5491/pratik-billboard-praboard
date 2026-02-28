import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, PrimaryButton } from '../../components';
import PraboardLogo from '../../components/PraboardLogo';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      // Auth state değişince navigation otomatik yönlendirecek
    } catch (err) {
      const msg = err?.message || '';
      const status = err?.status || err?.statusCode;
      if (status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
        setError('Çok fazla deneme yaptınız. Lütfen birkaç dakika bekleyip tekrar deneyin.');
      } else if (msg.includes('Invalid login credentials')) {
        setError('E-posta veya şifre hatalı.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Lütfen önce e-posta adresinizi doğrulayın.');
      } else {
        setError('Giriş yapılırken bir hata oluştu. Tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient colors={['#FF4B4B', '#FF6B6B']} style={styles.header}>
            <PraboardLogo size={88} variant="onGradient" />
            <Text style={styles.headerTitle}>Giriş Yap</Text>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.title}>Hoş geldin!</Text>
            <Text style={styles.subtitle}>
              Giriş yapmak için lütfen bilgilerini gir.
            </Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <TextInput
                label="E-Posta"
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                label="Şifre"
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
                secureTextEntry
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPasswordContainer}
              >
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
              </TouchableOpacity>

              <PrimaryButton
                title={loading ? '' : 'Giriş Yap'}
                onPress={handleLogin}
                disabled={loading}
                style={styles.submitButton}
              />
              {loading && (
                <ActivityIndicator
                  color={colors.white}
                  style={styles.loadingIndicator}
                />
              )}

              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>
                  Hesabın yok mu? <Text style={styles.linkBold}>Kayıt ol!</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.5,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 52,
  },
  linkText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  linkBold: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
