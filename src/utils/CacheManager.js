import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get cache size in MB
export const getCacheSize = async () => {
  try {
    // Get all keys
    const keys = await AsyncStorage.getAllKeys();
    
    // Calculate total size
    let totalSize = 0;
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        // Calculate size in bytes (2 bytes per character in UTF-16)
        totalSize += value.length * 2;
      }
    }
    
    // Convert to MB
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    return sizeMB;
  } catch (error) {
    console.error('Error calculating cache size:', error);
    return '0';
  }
};

// Function to clear all cache
export const clearCache = async () => {
  try {
    // Get all keys except critical ones
    const allKeys = await AsyncStorage.getAllKeys();
    
    // Define keys to preserve (important app settings)
    const preserveKeys = ['themeMode', 'userCredentials', 'apiKeys'];
    
    // Filter out keys to preserve
    const keysToRemove = allKeys.filter(key => !preserveKeys.includes(key));
    
    // Clear the filtered keys
    if (keysToRemove.length > 0) {
      await AsyncStorage.multiRemove(keysToRemove);
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
};

// Function to clear chat history
export const clearChatHistory = async () => {
  try {
    // Get all keys
    const allKeys = await AsyncStorage.getAllKeys();
    
    // Filter chat history keys
    const chatKeys = allKeys.filter(key => key.startsWith('chat_'));
    
    // Remove chat keys
    if (chatKeys.length > 0) {
      await AsyncStorage.multiRemove(chatKeys);
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return false;
  }
};

export default {
  getCacheSize,
  clearCache,
  clearChatHistory
};