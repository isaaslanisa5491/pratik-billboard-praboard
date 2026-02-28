import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import PraboardLogo from '../../components/PraboardLogo';

/* ─────────────────────────── helpers ─────────────────────────── */

const BLUR = Platform.select({
  web: { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' },
  default: {},
});

function LogoMark({ size = 36, dark }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        backgroundColor: dark ? colors.eco.emerald : 'rgba(255,255,255,0.12)',
        borderWidth: dark ? 0 : 1,
        borderColor: dark ? 'transparent' : colors.glass.border,
        justifyContent: 'center',
        alignItems: 'center',
        ...(!dark ? BLUR : {}),
      }}
    >
      <PraboardLogo size={size * 0.62} variant="onGradient" />
    </View>
  );
}

function StatItem({ number, label }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ fontSize: 32, fontWeight: '800', color: '#fff' }}>{number}</Text>
      <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
        {label}
      </Text>
    </View>
  );
}

function FeatureCard({ icon, title, description, isWide }) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 28,
        flex: isWide ? 1 : undefined,
        width: isWide ? undefined : '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundColor: colors.eco.mint,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Ionicons name={icon} size={26} color={colors.eco.emerald} />
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 22 }}>
        {description}
      </Text>
    </View>
  );
}

function StepItem({ number, title, description, icon, isWide }) {
  return (
    <View style={{ flex: isWide ? 1 : undefined, alignItems: 'center', paddingHorizontal: 16 }}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.eco.leaf,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
          shadowColor: colors.eco.leaf,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
        }}
      >
        <Ionicons name={icon} size={26} color="#fff" />
      </View>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: colors.eco.leaf,
          marginBottom: 6,
          letterSpacing: 1,
        }}
      >
        ADIM {number}
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#fff',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 22,
          textAlign: 'center',
          maxWidth: 260,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

function Connector() {
  return (
    <View
      style={{
        width: 48,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginTop: 30,
      }}
    />
  );
}

/* ─────────────────────────── MAIN ─────────────────────────── */

export default function LandingPage({ navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const maxW = 1100;
  const px = isWide ? 60 : 24;

  const goTo = (screen) => navigation?.navigate(screen);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F7FAF8' }}
      showsVerticalScrollIndicator={false}
    >
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <LinearGradient
        colors={['#071E14', '#0B3D2E', '#14693E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: '100%', overflow: 'hidden', position: 'relative' }}
      >
        {/* Decorative blobs */}
        <View
          style={{
            position: 'absolute',
            right: -100,
            top: -80,
            width: 380,
            height: 380,
            borderRadius: 190,
            backgroundColor: 'rgba(39, 174, 96, 0.07)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: -120,
            bottom: -60,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: 'rgba(39, 174, 96, 0.05)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: '15%',
            bottom: '8%',
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: 'rgba(255, 75, 75, 0.05)',
          }}
        />

        {/* ─── Navbar ─── */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            paddingTop: 28,
            paddingBottom: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <LogoMark size={38} />
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>
              Praboard
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={() => goTo('Login')}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
                backgroundColor: colors.glass.light,
                ...BLUR,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Giris Yap</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => goTo('Register')}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: colors.primary,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Kayit Ol</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Hero Content ─── */}
        <View
          style={{
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            paddingTop: isWide ? 80 : 56,
            paddingBottom: 70,
          }}
        >
          {/* Eco badge */}
          <View
            style={{
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.glass.light,
              borderWidth: 1,
              borderColor: colors.glass.border,
              borderRadius: 100,
              paddingHorizontal: 18,
              paddingVertical: 8,
              gap: 8,
              ...BLUR,
            }}
          >
            <Ionicons name="leaf" size={15} color={colors.eco.leaf} />
            <Text style={{ color: colors.eco.sage, fontSize: 14, fontWeight: '600' }}>
              Cevreci · Pratik · Etkili
            </Text>
          </View>

          {/* Headline */}
          <Text
            style={{
              color: '#fff',
              fontSize: isWide ? 60 : 38,
              fontWeight: '800',
              lineHeight: isWide ? 70 : 46,
              letterSpacing: -1.5,
              maxWidth: 700,
              marginTop: 28,
            }}
          >
            Dijital Billboard{'\n'}Reklamciliginin{'\n'}
            <Text style={{ color: colors.eco.leaf }}>Gelecegi</Text>
          </Text>

          {/* Sub */}
          <Text
            style={{
              color: 'rgba(255,255,255,0.72)',
              fontSize: isWide ? 20 : 17,
              lineHeight: isWide ? 30 : 26,
              maxWidth: 520,
              marginTop: 24,
            }}
          >
            Praboard ile cevreci dijital billboard agina katilin.
            Dusuk maliyetle, yuksek gorunurluk elde edin.
          </Text>

          {/* CTAs */}
          <View style={{ flexDirection: 'row', gap: 14, marginTop: 40, flexWrap: 'wrap' }}>
            <TouchableOpacity
              onPress={() => goTo('Register')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.primary,
                paddingHorizontal: 28,
                paddingVertical: 16,
                borderRadius: 14,
                gap: 8,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
              }}
            >
              <Ionicons name="rocket-outline" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Hemen Basla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
                backgroundColor: colors.glass.light,
                gap: 8,
                ...BLUR,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Nasil Calisir?</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Glass stats */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.glass.medium,
              borderWidth: 1,
              borderColor: colors.glass.border,
              borderRadius: 20,
              paddingVertical: 28,
              paddingHorizontal: 8,
              marginTop: 64,
              maxWidth: 640,
              ...BLUR,
            }}
          >
            <StatItem number="150+" label="Aktif Panel" />
            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <StatItem number="500+" label="Reklam Veren" />
            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <StatItem number="15+" label="Sehir" />
            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <StatItem number="%98" label="Memnuniyet" />
          </View>
        </View>
      </LinearGradient>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <View style={{ backgroundColor: '#F7FAF8', paddingVertical: isWide ? 100 : 64 }}>
        <View
          style={{
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
          }}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View
              style={{
                backgroundColor: colors.eco.mint,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 100,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: colors.eco.emerald, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 }}>
                OZELLIKLER
              </Text>
            </View>
            <Text
              style={{
                fontSize: isWide ? 42 : 30,
                fontWeight: '800',
                color: colors.textPrimary,
                letterSpacing: -1,
                textAlign: 'center',
              }}
            >
              Neden <Text style={{ color: colors.eco.emerald }}>Praboard</Text>?
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: colors.textSecondary,
                marginTop: 12,
                textAlign: 'center',
                maxWidth: 480,
              }}
            >
              Cevreci teknoloji ile reklamciligi yeniden tanimliyoruz
            </Text>
          </View>

          {/* Cards */}
          <View style={{ flexDirection: isWide ? 'row' : 'column', gap: 20 }}>
            <FeatureCard
              icon="leaf-outline"
              title="Cevreci Teknoloji"
              description="Dusuk enerji tuketimli LED panellerle cevreye duyarli dijital reklamcilik"
              isWide={isWide}
            />
            <FeatureCard
              icon="globe-outline"
              title="Genis Ag"
              description="Turkiye genelinde 15+ sehirde aktif dijital billboard agi"
              isWide={isWide}
            />
            <FeatureCard
              icon="wallet-outline"
              title="Uygun Fiyat"
              description="Geleneksel billboardlara gore %60 daha uygun reklam fiyatlari"
              isWide={isWide}
            />
            <FeatureCard
              icon="flash-outline"
              title="Kolay Kullanim"
              description="Sadece 3 adimda reklaminizi olusturup yayina alin"
              isWide={isWide}
            />
          </View>
        </View>
      </View>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <LinearGradient
        colors={['#0D4F2B', '#1B8A4A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingVertical: isWide ? 100 : 64 }}
      >
        <View
          style={{
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
          }}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 56 }}>
            <View
              style={{
                backgroundColor: colors.glass.light,
                borderWidth: 1,
                borderColor: colors.glass.border,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 100,
                marginBottom: 16,
                ...BLUR,
              }}
            >
              <Text style={{ color: colors.eco.sage, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 }}>
                ADIMLAR
              </Text>
            </View>
            <Text
              style={{
                fontSize: isWide ? 42 : 30,
                fontWeight: '800',
                color: '#fff',
                letterSpacing: -1,
                textAlign: 'center',
              }}
            >
              Nasil Calisir?
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: 'rgba(255,255,255,0.6)',
                marginTop: 12,
                textAlign: 'center',
              }}
            >
              3 basit adimda reklaminizi yayina alin
            </Text>
          </View>

          {/* Steps */}
          <View
            style={{
              flexDirection: isWide ? 'row' : 'column',
              gap: isWide ? 0 : 44,
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <StepItem
              number="1"
              icon="cloud-upload-outline"
              title="Reklaminizi Yukleyin"
              description="Gorsel veya video icerigizi kampanya detaylariyla birlikte yukleyin"
              isWide={isWide}
            />
            {isWide && <Connector />}
            <StepItem
              number="2"
              icon="map-outline"
              title="Panel Secin"
              description="Harita uzerinden lokasyonunuza en uygun dijital paneli secin"
              isWide={isWide}
            />
            {isWide && <Connector />}
            <StepItem
              number="3"
              icon="play-circle-outline"
              title="Yayina Alin"
              description="Onay sonrasi reklaminiz sectiginiz panelde aninda yayinlanir"
              isWide={isWide}
            />
          </View>
        </View>
      </LinearGradient>

      {/* ═══════════════════════ TRUST BAR ═══════════════════════ */}
      <View
        style={{
          backgroundColor: '#fff',
          paddingVertical: 40,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: 'rgba(0,0,0,0.04)',
        }}
      >
        <View
          style={{
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            flexDirection: isWide ? 'row' : 'column',
            gap: isWide ? 0 : 24,
          }}
        >
          {[
            { icon: 'shield-checkmark-outline', text: 'SSL Guvenlik Sertifikasi' },
            { icon: 'time-outline', text: '7/24 Teknik Destek' },
            { icon: 'card-outline', text: 'Guvenli Odeme Altyapisi' },
            { icon: 'trending-up-outline', text: 'Canli Performans Takibi' },
          ].map((item, i) => (
            <View key={i} style={{ flex: isWide ? 1 : undefined, flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: colors.eco.mint,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name={item.icon} size={20} color={colors.eco.emerald} />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <View style={{ backgroundColor: '#F7FAF8', paddingVertical: isWide ? 100 : 64 }}>
        <View
          style={{
            maxWidth: 700,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: 22,
              backgroundColor: colors.eco.mint,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 28,
            }}
          >
            <Ionicons name="leaf" size={34} color={colors.eco.emerald} />
          </View>
          <Text
            style={{
              fontSize: isWide ? 42 : 30,
              fontWeight: '800',
              color: colors.textPrimary,
              letterSpacing: -1,
              textAlign: 'center',
            }}
          >
            Reklamciliga{' '}
            <Text style={{ color: colors.eco.emerald }}>Yesil</Text> Bir Adim Atin
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: colors.textSecondary,
              marginTop: 16,
              textAlign: 'center',
              maxWidth: 480,
            }}
          >
            Hemen ucretsiz hesap olusturun ve cevreci dijital billboard agina katilin
          </Text>
          <TouchableOpacity
            onPress={() => goTo('Register')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.primary,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 14,
              gap: 8,
              marginTop: 36,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
            }}
          >
            <Ionicons name="person-add-outline" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
              Ucretsiz Hesap Olustur
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <View style={{ backgroundColor: colors.eco.forest, paddingVertical: 40 }}>
        <View
          style={{
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: px,
            flexDirection: isWide ? 'row' : 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <LogoMark size={28} dark />
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Praboard</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
            © 2026 Praboard. Tum haklari saklidir.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
