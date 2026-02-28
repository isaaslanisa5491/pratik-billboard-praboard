import React, { useState } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { colors } from '../theme';
import BottomTabBar from '../components/BottomTabBar';
import CreateActionModal from '../components/CreateActionModal';

// Screens
import LandingPage from '../screens/Landing/LandingPage';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import UsernameSelectScreen from '../screens/Auth/UsernameSelectScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import EmailVerifiedScreen from '../screens/Auth/EmailVerifiedScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import LocationSelectScreen from '../screens/Location/LocationSelectScreen';
import FilterScreen from '../screens/Filter/FilterScreen';
import AdUploadScreen from '../screens/AdUpload/AdUploadScreen';
import AdDetailScreen from '../screens/AdDetail/AdDetailScreen';
import PanelsScreen from '../screens/Panels/PanelsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import OrderDetailScreen from '../screens/Orders/OrderDetailScreen';
import AdminScreen from '../screens/Admin/AdminScreen';

// Screens that show the bottom tab bar
const MAIN_TABS = ['HomeTab', 'Panels', 'Notifications', 'ProfileTab'];

export default function AppNavigator({ navigation }) {
  const [activeTab, setActiveTab] = useState('HomeTab');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const currentRoute = navigation.currentRoute?.name;

  const isMainScreen = MAIN_TABS.includes(currentRoute);

  const handleTabPress = (tabName) => {
    if (tabName === 'AddAd') {
      setShowCreateModal(true);
      return;
    }
    setActiveTab(tabName);
    navigation.reset(tabName);
  };

  const renderScreen = () => {
    // For main tab screens
    if (isMainScreen) {
      switch (activeTab) {
        case 'HomeTab': return <HomeScreen navigation={navigation} />;
        case 'Panels': return <PanelsScreen navigation={navigation} />;
        case 'Notifications': return <NotificationsScreen navigation={navigation} />;
        case 'ProfileTab': return <ProfileScreen navigation={navigation} />;
        default: return <HomeScreen navigation={navigation} />;
      }
    }

    // For non-tab screens
    switch (currentRoute) {
      case 'Loading': return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
      case 'Landing': return <LandingPage navigation={navigation} />;
      case 'Onboarding': return <OnboardingScreen navigation={navigation} />;
      case 'Register': return <RegisterScreen navigation={navigation} />;
      case 'Login': return <LoginScreen navigation={navigation} />;
      case 'UsernameSelect': return <UsernameSelectScreen navigation={navigation} />;
      case 'ForgotPassword': return <ForgotPasswordScreen navigation={navigation} />;
      case 'ResetPassword': return <ResetPasswordScreen navigation={navigation} />;
      case 'EmailVerified': return <EmailVerifiedScreen navigation={navigation} />;
      case 'LocationSelect': return <LocationSelectScreen navigation={navigation} />;
      case 'Filter': return <FilterScreen navigation={navigation} />;
      case 'AdUpload': return <AdUploadScreen navigation={navigation} />;
      case 'AdDetail': return <AdDetailScreen navigation={navigation} />;
      case 'EditProfile': return <EditProfileScreen navigation={navigation} />;
      case 'OrderDetail': return <OrderDetailScreen navigation={navigation} />;
      case 'Admin': return <AdminScreen navigation={navigation} />;
      default: return <OnboardingScreen navigation={navigation} />;
    }
  };

  const isLanding = currentRoute === 'Landing';

  return (
    <View style={[styles.outerContainer, isLanding && { backgroundColor: '#F7FAF8' }]}>
      <View style={[styles.container, isLanding && styles.containerFull]}>
        <View style={styles.screenContainer}>
          {renderScreen()}
        </View>
        {isMainScreen && (
          <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
        )}
      </View>

      <CreateActionModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSharePost={() => {
          navigation.navigate('AdUpload');
        }}
        onCreateAd={() => {
          setActiveTab('Panels');
          navigation.reset('Panels');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    ...(Platform.OS === 'web' ? { maxWidth: 480 } : {}),
  },
  containerFull: {
    ...(Platform.OS === 'web' ? { maxWidth: '100%' } : {}),
  },
  screenContainer: {
    flex: 1,
  },
});
