import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';
import PraboardLogo from '../../components/PraboardLogo';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: "Praboard'a hoş geldin!",
    subtitle:
      'Praboard ile yerel etkinlikleri ve reklamları dijital panolar üzerinden keşfedin! Bölgenizdeki güncel fırsatlara kolayca ulaş, işletmenin sesini duyur ve reklamlarını geniş kitlelere ulaştır.',
    icon: 'P',
  },
  {
    id: '2',
    title: 'Şehrinle konuş',
    subtitle:
      'Praboard ile şehrinin nabzını tut! Etkinlikleri ve fırsatları keşfet, işletmeni dijital panolarla herkese duyur.',
    icon: 'list',
  },
  {
    id: '3',
    title: 'Yerel kampanya yönetimi',
    subtitle:
      'Praboard ile bölgene özel kampanyalar düzenle, etkileşimleri anında gör!',
    icon: 'cloud-upload',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const handleCTA = () => {
    navigation.replace('Register');
  };

  const renderIcon = (icon) => {
    if (icon === 'P') {
      return (
        <View style={styles.logoContainer}>
          <PraboardLogo size={110} variant="onGradient" />
        </View>
      );
    } else if (icon === 'list') {
      return (
        <View style={styles.iconContainer}>
          <Ionicons name="list" size={80} color={colors.white} />
        </View>
      );
    } else if (icon === 'cloud-upload') {
      return (
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-upload" size={80} color={colors.white} />
        </View>
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.page}>
      <View style={styles.contentContainer}>
        {renderIcon(item.icon)}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#FF4B4B', '#FF4B4B']} style={styles.container}>
      {/* Header with dots and skip button */}
      <View style={styles.header}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Tanıtımı Atla &gt;</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        style={styles.carousel}
      />

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity onPress={handleCTA} style={styles.ctaButton}>
          <Text style={styles.ctaText}>Şimdi katıl, reklamını yayınla!</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: colors.white,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  carousel: {
    flex: 1,
  },
  page: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  ctaContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  ctaButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ctaText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
