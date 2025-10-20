/*
MobX Store для управления темой приложения
Отвечает за переключение между светлой и темной темой
 */
import { makeAutoObservable, reaction } from 'mobx';
import { ThemeMode, createTheme, Theme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

/*
Класс хранилища темы с реактивным состоянием
Управляет текущей темой и ее сохранением в памяти устройства
 */
export class ThemeStore {
  // Текущий режим темы
  mode: ThemeMode = 'system';
  // Текущая тема (вычисляется на основе режима)
  currentTheme: Theme;

  constructor() {
    // Инициализируем текущую тему по умолчанию
    this.currentTheme = createTheme('system');
    makeAutoObservable(this);

    // Загружаем сохраненную тему при инициализации
    this.loadTheme();

    // Создаем реакцию на изменения режима темы
    reaction(
      () => this.mode,
      (mode) => {
        this.currentTheme = createTheme(mode);
        this.saveTheme(mode);
      }
    );

    // Подписываемся на изменения системной темы
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (this.mode === 'system') {
        this.currentTheme = createTheme('system');
      }
    });

    // Сохраняем функцию отписки для очистки ресурсов
    this.cleanup = () => subscription?.remove();
  }

  // Функция очистки ресурсов (для отписки от слушателей)
  private cleanup?: () => void;

  /*
  Загрузка сохраненной темы из AsyncStorage
   */
  async loadTheme() {
    try {
      const savedMode = await AsyncStorage.getItem('theme_mode') as ThemeMode;
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        this.setTheme(savedMode);
      } else {
        // Если нет сохраненной темы, используем системную
        this.setTheme('system');
      }
    } catch (e) {
      console.error('ThemeStore: Error loading theme', e);
      this.setTheme('system');
    }
  }

  /*
  Сохранение темы в AsyncStorage
  @param mode - режим темы для сохранения
   */
  async saveTheme(mode: ThemeMode) {
    try {
      await AsyncStorage.setItem('theme_mode', mode);
      console.log('ThemeStore: Theme saved', mode);
    } catch (e) {
      console.error('ThemeStore: Error saving theme', e);
    }
  }

  /*
  Установка режима темы
  @param mode - новый режим темы
   */
  setTheme(mode: ThemeMode) {
    this.mode = mode;
    // currentTheme будет обновлена автоматически через reaction
  }

  /*
  Переключение на светлую тему
   */
  setLightTheme() {
    this.setTheme('light');
  }

  /*
  Переключение на темную тему
   */
  setDarkTheme() {
    this.setTheme('dark');
  }

  /*
  Переключение на системную тему
   */
  setSystemTheme() {
    this.setTheme('system');
  }

  /*
  Переключение между светлой и темной темой
   */
  toggleTheme() {
    if (this.mode === 'light') {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  /*
  Очистка ресурсов при уничтожении store
   */
  destroy() {
    if (this.cleanup) {
      this.cleanup();
    }
  }
}

export default ThemeStore;
