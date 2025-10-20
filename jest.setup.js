/*
 * Настройка тестовой среды для React Native Testing Library
 * Конфигурирует моки и глобальные переменные для тестирования
 */
import '@testing-library/react-native';

// Мок для react-native-geolocation-service
jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
  requestAuthorization: jest.fn(),
}));

// Мок для react-native-permissions
jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    ANDROID: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
  },
  request: jest.fn(),
  check: jest.fn(),
}));

// Мок для PermissionsAndroid из react-native
jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
  PERMISSIONS: {
    ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
  },
  request: jest.fn(),
  check: jest.fn(),
}));

// Дополнительный мок для PermissionsAndroid напрямую
jest.mock('react-native', () => ({
  PermissionsAndroid: {
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
    request: jest.fn(),
    check: jest.fn(),
  },
}));

// Мок для React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
}));

// Мок для React Navigation Stack
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: function({ children }) { return children; },
    Screen: function({ children }) { return children; },
  }),
}));

// Мок для MobX stores
jest.mock('./src/app/providers/AppProviders', () => ({
  useStores: () => ({
    shiftsStore: {
      loading: false,
      error: null,
      items: [],
      loadByCoords: jest.fn(),
      setSelected: jest.fn(),
    },
  }),
}));

// Мок для mobx-react-lite
jest.mock('mobx-react-lite', () => ({
  observer: function(component) { return component; },
}));



// Мок для базовых компонентов React Native
jest.mock('react-native', () => ({
  StyleSheet: {
    create: jest.fn(function(styles) { return styles; }),
    flatten: jest.fn(function(styles) { return styles; }),
    absoluteFillObject: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    hairlineWidth: 1,
  },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  FlatList: 'FlatList',
  Image: 'Image',
  ScrollView: 'ScrollView',
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  Platform: {
    OS: 'ios',
    Version: '14.0',
    select: jest.fn(function(obj) { return obj.ios || obj.default; }),
  },
  Alert: {
    alert: jest.fn(),
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
    request: jest.fn(),
    check: jest.fn(),
  },
}));

// Глобальные переменные для React Native
global.__DEV__ = true;

// Мок для console методов в тестах
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
