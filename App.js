import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nManager } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';
import ChatScreen from './src/screens/ChatScreenNew';
import APISettingsScreen from './src/screens/APISettingsScreen';
import UpgradeScreen from './src/screens/UpgradeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FeatureLabScreen from './src/screens/FeatureLabScreen';
import DataControlsScreen from './src/screens/DataControlsScreen';
import CloudBrowserScreen from './src/screens/CloudBrowserScreen';
import AccountSettingsScreen from './src/screens/AccountSettingsScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';

// Import theme provider
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Enable RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Stack = createStackNavigator();

// Main app component with theme context
const MainApp = () => {
  const { theme, isDark } = useTheme();
  
  // Configure Paper theme based on our theme
  const paperTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...isDark ? DarkTheme.colors : DefaultTheme.colors,
      primary: theme.primary,
      accent: theme.accent,
      background: theme.background,
      surface: theme.surface,
      text: theme.text,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={{
        dark: isDark,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: theme.border,
          notification: theme.notification,
        }
      }}>
        <StatusBar style={theme.statusBar} />
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="APISettings" component={APISettingsScreen} />
          <Stack.Screen name="Upgrade" component={UpgradeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="FeatureLab" component={FeatureLabScreen} />
          <Stack.Screen name="DataControls" component={DataControlsScreen} />
          <Stack.Screen name="CloudBrowser" component={CloudBrowserScreen} />
          <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

// Root component that wraps the app with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
