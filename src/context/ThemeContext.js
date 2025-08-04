import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

// Define theme colors
export const lightTheme = {
  primary: '#2c2c2c',
  accent: '#f0f0f0',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  border: '#eeeeee',
  card: '#ffffff',
  notification: '#ff4444',
  icon: '#666666',
  statusBar: 'dark',
};

export const darkTheme = {
  primary: '#2c2c2c',
  accent: '#333333',
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  border: '#333333',
  card: '#1e1e1e',
  notification: '#ff4444',
  icon: '#aaaaaa',
  statusBar: 'light',
};

// Theme modes
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Create context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(THEME_MODE.SYSTEM);
  const [theme, setTheme] = useState(systemColorScheme === 'dark' ? darkTheme : lightTheme);
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Load saved theme mode from AsyncStorage
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('themeMode');
        if (savedThemeMode) {
          setThemeMode(savedThemeMode);
          updateTheme(savedThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme mode:', error);
      }
    };

    loadThemeMode();
  }, []);

  // Update theme when system color scheme changes
  useEffect(() => {
    if (themeMode === THEME_MODE.SYSTEM) {
      setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, themeMode]);

  // Update theme based on selected mode
  const updateTheme = (mode) => {
    switch (mode) {
      case THEME_MODE.LIGHT:
        setTheme(lightTheme);
        setIsDark(false);
        break;
      case THEME_MODE.DARK:
        setTheme(darkTheme);
        setIsDark(true);
        break;
      case THEME_MODE.SYSTEM:
        setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
        setIsDark(systemColorScheme === 'dark');
        break;
      default:
        setTheme(lightTheme);
        setIsDark(false);
    }
  };

  // Change theme mode
  const changeThemeMode = async (mode) => {
    setThemeMode(mode);
    updateTheme(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        themeMode,
        changeThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};