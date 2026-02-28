import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../../components';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export default function EmailVerifiedScreen({ navigation }) {
  const { user, hasUsername, clearEmailVerified } = useAuth();

  const handleContinue = () => {
    clearEmailVerified();
    if (hasUsername) {
      navigation.reset('HomeTab');
    } else {
      navigation.navigate('UsernameSelect');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#FF4B4B', '#FF6B6B']} style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={72} color={colors.white} />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>E-posta Adresiniz{'\n'}Doğrulandı!</Text>

            {user?.email ? (
              <View style={styles.emailBadge}>
                <Ionicons name="mail-outline" size={16} color={colors.primary} />
                <Text style={styles.emailText}>{user.email}</Text>
              </View>
            ) : null}

            <Text style={styles.description}>
              Praboard'a hoş geldiniz! Hesabınız başarıyla aktif edildi. Artık billboard dünyasını keşfetmeye hazırsınız.
            </Text>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Yakınındaki panolara göz at</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="megaphone-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Reklamını yayınla</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="stats-chart-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Kampanyalarını takip et</Text>
              </View>
            </View>

            <PrimaryButton
              title="Devam Et"
              onPress={handleContinue}
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    marginTop: -40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 34,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 20,
    gap: 6,
  },
  emailText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  featureList: {
    gap: 12,
    marginBottom: 28,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  button: {
    marginTop: 4,
  },
});
