/*
Конфигурация темы приложения
Поддержка светлой и темной темы с цветовой палитрой
 */
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Основные цвета
  primary: string;
  secondary: string;
  accent: string;

  // Фон
  background: string;
  surface: string;
  card: string;

  // Текст
  text: string;
  textSecondary: string;
  textMuted: string;

  // Границы и разделители
  border: string;
  separator: string;

  // Состояния
  success: string;
  warning: string;
  error: string;
  info: string;

  // Skeleton loading
  skeleton: string;
  skeletonHighlight: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
}

// Цвета для светлой темы
const lightColors: ThemeColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',

  background: '#F2F2F7',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  text: '#000000',
  textSecondary: '#3C3C43',
  textMuted: '#8E8E93',

  border: '#C6C6C8',
  separator: '#E5E5EA',

  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',

  skeleton: '#E5E5EA',
  skeletonHighlight: '#F2F2F7',
};

// Цвета для темной темы
const darkColors: ThemeColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#FF9F0A',

  background: '#000000',
  surface: '#1C1C1E',
  card: '#2C2C2E',

  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textMuted: '#8E8E93',

  border: '#38383A',
  separator: '#38383A',

  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#0A84FF',

  skeleton: '#1C1C1E',
  skeletonHighlight: '#2C2C2E',
};

// Создание темы на основе режима
export const createTheme = (mode: ThemeMode): Theme => {
  const isDark = mode === 'dark' ||
    (mode === 'system' && Appearance.getColorScheme() === 'dark');

  return {
    mode,
    colors: isDark ? darkColors : lightColors,
    isDark,
  };
};

// Экспорт цветов по умолчанию (светлая тема)
export const defaultTheme = createTheme('light');

// Экспорт цветов для текущей системной темы
export const systemTheme = createTheme('system');
