/*
Компонент переключения темы приложения
Предоставляет интерфейс для смены между светлой, темной и системной темой
 */
import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../app/providers/AppProviders';

/*
Пропсы компонента переключения темы
 */
interface ThemeToggleProps {
  // Размер компонента
  size?: 'small' | 'medium' | 'large';
  // Показывать ли текст с текущей темой
  showLabel?: boolean;
}

/*
Компонент переключения темы с поддержкой MobX наблюдения
@param props - пропсы компонента
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = observer(({ size = 'medium', showLabel = false }) => {
  const { themeStore } = useStores();

  /*
  Получение следующего режима темы для циклического переключения
  @returns следующий режим темы
   */
  const getNextTheme = () => {
    switch (themeStore.mode) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
        return 'light';
      default:
        return 'system';
    }
  };

  /*
  Получение названия темы для отображения
  @param mode - режим темы
  @returns человеко-читаемое название темы
   */
  const getThemeLabel = (mode: string) => {
    switch (mode) {
      case 'light':
        return 'Светлая';
      case 'dark':
        return 'Темная';
      case 'system':
        return 'Системная';
      default:
        return 'Системная';
    }
  };

  /*
  Обработчик переключения темы
   */
  const handleToggle = () => {
    const nextTheme = getNextTheme();
    themeStore.setTheme(nextTheme);
  };

  const iconSize = size === 'small' ? 20 : size === 'medium' ? 24 : 28;
  const getContainerStyle = () => {
    switch (size) {
      case 'small':
        return styles.containerSmall;
      case 'large':
        return styles.containerLarge;
      default:
        return styles.containerMedium;
    }
  };

  const containerStyle = [
    styles.container,
    getContainerStyle(),
    {
      backgroundColor: themeStore.currentTheme.colors.surface,
      borderColor: themeStore.currentTheme.colors.border
    }
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {themeStore.mode === 'light' && (
          <Text style={[styles.icon, { fontSize: iconSize, color: themeStore.currentTheme.colors.text }]}>
            ☀️
          </Text>
        )}
        {themeStore.mode === 'dark' && (
          <Text style={[styles.icon, { fontSize: iconSize, color: themeStore.currentTheme.colors.text }]}>
            🌙
          </Text>
        )}
        {themeStore.mode === 'system' && (
          <Text style={[styles.icon, { fontSize: iconSize, color: themeStore.currentTheme.colors.text }]}>
            📱
          </Text>
        )}
      </View>

      {showLabel && (
        <Text style={[styles.label, { color: themeStore.currentTheme.colors.textSecondary }]}>
          {getThemeLabel(themeStore.mode)}
        </Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  containerMedium: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  containerLarge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default ThemeToggle;
