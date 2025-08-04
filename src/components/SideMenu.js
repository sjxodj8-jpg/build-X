import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
  Share,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AIService from '../services/AIService';
import { useTheme, THEME_MODE } from '../context/ThemeContext';
import CacheManager from '../utils/CacheManager';

const { width, height } = Dimensions.get('window');

const SideMenu = ({ userType, email, name, userPoints, onClose, navigation }) => {
  const { theme, isDark, themeMode, changeThemeMode } = useTheme();
  const [cacheSize, setCacheSize] = useState('0');
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Load cache size on component mount
  useEffect(() => {
    const loadCacheSize = async () => {
      const size = await CacheManager.getCacheSize();
      setCacheSize(size);
    };
    
    loadCacheSize();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تسجيل الخروج', 
          onPress: () => {
            onClose();
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  // Handle theme change
  const handleThemeChange = (mode) => {
    changeThemeMode(mode);
    setShowThemeModal(false);
  };

  // Handle cache clearing
  const handleClearCache = () => {
    Alert.alert(
      'مسح ذاكرة التخزين المؤقت',
      'هل تريد مسح جميع البيانات المؤقتة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح',
          onPress: async () => {
            const success = await CacheManager.clearCache();
            if (success) {
              Alert.alert('تم', 'تم مسح ذاكرة التخزين المؤقت بنجاح');
              setCacheSize('0');
            } else {
              Alert.alert('خطأ', 'حدث خطأ أثناء مسح ذاكرة التخزين المؤقت');
            }
          }
        }
      ]
    );
  };

  // Get theme mode text
  const getThemeModeText = () => {
    switch (themeMode) {
      case THEME_MODE.LIGHT:
        return 'فاتح';
      case THEME_MODE.DARK:
        return 'داكن';
      case THEME_MODE.SYSTEM:
        return 'اتباع النظام';
      default:
        return 'اتباع النظام';
    }
  };

  const menuItems = [
    {
      icon: 'flask-outline',
      title: 'مختبر الميزات',
      onPress: () => {
        onClose();
        navigation.navigate('FeatureLab');
      }
    },
    {
      icon: 'shield-outline',
      title: 'ضوابط البيانات',
      onPress: () => {
        onClose();
        navigation.navigate('DataControls');
      }
    },
    {
      icon: 'desktop-outline',
      title: 'متصفح السحابية',
      onPress: () => {
        onClose();
        navigation.navigate('CloudBrowser');
      }
    },
    {
      icon: 'globe-outline',
      title: 'اللغة',
      subtitle: 'العربية',
      onPress: () => {
        onClose();
        navigation.navigate('Settings', { userType, email, name, userPoints });
      }
    },
    {
      icon: 'person-outline',
      title: 'الحساب',
      onPress: () => {
        onClose();
        navigation.navigate('AccountSettings', { userType, email, name, userPoints });
      }
    },
    {
      icon: 'settings-outline',
      title: 'إعدادات API',
      onPress: () => {
        onClose();
        navigation.navigate('APISettings');
      }
    },
    {
      icon: 'moon-outline',
      title: 'المظهر',
      subtitle: getThemeModeText(),
      onPress: () => {
        setShowThemeModal(true);
      }
    },
    {
      icon: 'trash-outline',
      title: 'مسح ذاكرة التخزين المؤقت',
      subtitle: `MB ${cacheSize}`,
      onPress: handleClearCache
    },
  ];

  const additionalItems = [
    {
      icon: 'share-outline',
      title: 'شارك التطبيق',
      onPress: async () => {
        try {
          await Share.share({
            message: 'جرب تطبيق Build X - مساعد الذكي الاصطناعي الأفضل!\n\nحمل التطبيق الآن: https://buildx.app',
            title: 'Build X - مساعد الذكي الاصطناعي'
          });
        } catch (error) {
          Alert.alert('خطأ', 'حدث خطأ أثناء المشاركة');
        }
      }
    },
    {
      icon: 'heart-outline',
      title: 'قيم هذا التطبيق',
      onPress: () => {
        Alert.alert(
          'تقييم التطبيق',
          'شكراً لاستخدامك Build X! هل تود تقييم التطبيق؟',
          [
            { text: 'لاحقاً', style: 'cancel' },
            {
              text: 'تقييم',
              onPress: () => {
                Alert.alert('شكراً!', 'سيتم توجيهك لمتجر التطبيقات');
              }
            }
          ]
        );
      }
    },
    {
      icon: 'help-circle-outline',
      title: 'الحصول على مساعدة',
      onPress: () => {
        onClose();
        navigation.navigate('HelpSupport');
      }
    },
    {
      icon: 'settings-outline',
      title: 'جميع الإعدادات',
      onPress: () => {
        onClose();
        navigation.navigate('Settings', { userType, email, name, userPoints });
      }
    },
  ];

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      
      <View style={[styles.menuContainer, { backgroundColor: theme.surface }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color={theme.icon} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={[styles.userSection, { borderBottomColor: theme.border }]}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userType === 'guest' ? 'ض' : (name ? name.charAt(0) : email?.charAt(0) || 'U')}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: theme.text }]}>
                  {userType === 'guest' ? 'ضيف' : (name || email)}
                </Text>
                {userType !== 'guest' && email && (
                  <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{email}</Text>
                )}
                <View style={[styles.planBadge, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
                  <Text style={[styles.planText, { color: theme.textSecondary }]}>Free</Text>
                </View>
              </View>
            </View>

            {/* Points Display */}
            <View style={[styles.pointsSection, { backgroundColor: isDark ? '#1a1a1a' : '#f8f8f8' }]}>
              <View style={styles.pointsRow}>
                <Text style={[styles.pointsLabel, { color: theme.text }]}>رصيد</Text>
                <View style={styles.pointsValue}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={[styles.pointsNumber, { color: theme.text }]}>{userPoints}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Build X</Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderBottomColor: theme.border }]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemContent}>
                  <Ionicons name={item.icon} size={20} color={theme.icon} />
                  <View style={styles.menuItemText}>
                    <Text style={[styles.menuItemTitle, { color: theme.text }]}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={[styles.menuItemSubtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-back" size={16} color={isDark ? '#666' : '#ccc'} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Items */}
          <View style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>معلومات</Text>
            {additionalItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderBottomColor: theme.border }]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemContent}>
                  <Ionicons name={item.icon} size={20} color={theme.icon} />
                  <Text style={[styles.menuItemTitle, { color: theme.text }]}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-back" size={16} color={isDark ? '#666' : '#ccc'} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          {userType !== 'guest' && (
            <TouchableOpacity 
              style={[styles.logoutButton, { borderTopColor: theme.border }]} 
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#ff4444" />
              <Text style={styles.logoutText}>تسجيل الخروج</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>اختر المظهر</Text>
            
            <TouchableOpacity 
              style={[
                styles.themeOption, 
                themeMode === THEME_MODE.LIGHT && styles.selectedThemeOption
              ]}
              onPress={() => handleThemeChange(THEME_MODE.LIGHT)}
            >
              <Ionicons 
                name={themeMode === THEME_MODE.LIGHT ? "radio-button-on" : "radio-button-off"} 
                size={24} 
                color={theme.primary} 
              />
              <Text style={[styles.themeOptionText, { color: theme.text }]}>فاتح</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.themeOption, 
                themeMode === THEME_MODE.DARK && styles.selectedThemeOption
              ]}
              onPress={() => handleThemeChange(THEME_MODE.DARK)}
            >
              <Ionicons 
                name={themeMode === THEME_MODE.DARK ? "radio-button-on" : "radio-button-off"} 
                size={24} 
                color={theme.primary} 
              />
              <Text style={[styles.themeOptionText, { color: theme.text }]}>داكن</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.themeOption, 
                themeMode === THEME_MODE.SYSTEM && styles.selectedThemeOption
              ]}
              onPress={() => handleThemeChange(THEME_MODE.SYSTEM)}
            >
              <Ionicons 
                name={themeMode === THEME_MODE.SYSTEM ? "radio-button-on" : "radio-button-off"} 
                size={24} 
                color={theme.primary} 
              />
              <Text style={[styles.themeOptionText, { color: theme.text }]}>اتباع النظام</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: width * 0.85,
    paddingTop: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  userSection: {
    padding: 20,
    borderBottomWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  planText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pointsSection: {
    borderRadius: 12,
    padding: 16,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  pointsValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  menuSection: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'right',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    textAlign: 'right',
  },
  menuItemSubtitle: {
    fontSize: 14,
    marginTop: 2,
    textAlign: 'right',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 20,
    borderTopWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4444',
    marginLeft: 12,
    fontWeight: '600',
  },
  // Theme Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedThemeOption: {
    backgroundColor: 'rgba(44, 44, 44, 0.1)',
  },
  themeOptionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SideMenu;