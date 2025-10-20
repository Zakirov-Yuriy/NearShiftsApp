/*
MobX Store для управления состоянием списка смен
Отвечает за загрузку, хранение и выбор смен
 */
import { makeAutoObservable, runInAction } from 'mobx';
import { Shift } from '../types/shift';
import { apiService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
Класс хранилища смен с реактивным состоянием
Управляет загрузкой данных, ошибками и выбранной сменой
 */
export class ShiftsStore {
  // Состояние загрузки данных
  loading = false;
  // Текст ошибки при неудачной загрузке
  error: string | null = null;
  // Массив загруженных смен
  items: Shift[] = [];
  // ID выбранной для просмотра смены
  selectedId: string | null = null;
  // Флаг обновления данных (для pull-to-refresh)
  refreshing = false;
  // Строка поиска
  searchQuery = '';
  // Фильтры для отображения смен
  filters = {
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    workTypes: [] as number[],
  };

  constructor() {
    makeAutoObservable(this);
  }

  /*
  Установка выбранной смены по ID
  @param id - уникальный идентификатор смены
   */
  setSelected(id: string) {
    this.selectedId = id;
  }

  /*
  Геттер для получения выбранной смены
  @returns выбранная смена или undefined если не найдена
   */
  get selected() {
    return this.items.find(s => s.id === this.selectedId);
  }

  /*
  Загрузка списка смен по географическим координатам
  Асинхронная функция с обработкой ошибок и состоянием загрузки
  @param lat - широта для поиска смен
  @param lon - долгота для поиска смен
   */
  async loadByCoords(lat: number, lon: number) {
    console.log('ShiftsStore: Starting loadByCoords', lat, lon);
    this.loading = true;
    this.error = null;

    try {
      // Запрашиваем данные с API
      const response = await apiService.getShifts(lat, lon);
      console.log('ShiftsStore: API response received', response);

      // Сохраняем полученные данные в store
      runInAction(() => {
        this.items = response.data ?? [];
        console.log('ShiftsStore: Items set', this.items.length, this.items);
      });

      // Сохраняем данные в кеш
      await this.saveToCache(lat, lon, response.data ?? []);
    } catch (e: any) {
      console.error('ShiftsStore: Error loading shifts', e);
      // Сохраняем текст ошибки в store
      runInAction(() => {
        this.error = e?.message && e.message.trim() ? e.message : "Network error";
      });
    } finally {
      // В любом случае снимаем флаг загрузки
      runInAction(() => {
        this.loading = false;
        console.log('ShiftsStore: Loading finished', this.loading);
      });
    }
  }

  /*
  Обновление данных с сервера (pull-to-refresh)
  @param lat - широта для поиска смен
  @param lon - долгота для поиска смен
   */
  async refreshData(lat: number, lon: number) {
    console.log('ShiftsStore: Refreshing data', lat, lon);
    this.refreshing = true;
    this.error = null;

    try {
      const response = await apiService.getShifts(lat, lon);
      console.log('ShiftsStore: Refresh response received', response);

      runInAction(() => {
        this.items = response.data ?? [];
      });

      // Обновляем кеш
      await this.saveToCache(lat, lon, response.data ?? []);
    } catch (e: any) {
      console.error('ShiftsStore: Error refreshing data', e);
      runInAction(() => {
        this.error = e?.message && e.message.trim() ? e.message : "Network error";
      });
    } finally {
      runInAction(() => {
        this.refreshing = false;
      });
    }
  }

  /*
  Загрузка данных из кеша
  @param lat - широта для поиска смен
  @param lon - долгота для поиска смен
   */
  async loadFromCache(lat: number, lon: number) {
    try {
      const cacheKey = `shifts_${lat}_${lon}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const CACHE_EXPIRY = 30 * 60 * 1000; // 30 минут

        if (Date.now() - timestamp < CACHE_EXPIRY) {
          console.log('ShiftsStore: Loading from cache');
          runInAction(() => {
            this.items = data;
          });
          return true;
        } else {
          // Кеш устарел, удаляем его
          await AsyncStorage.removeItem(cacheKey);
        }
      }
    } catch (e) {
      console.error('ShiftsStore: Error loading from cache', e);
    }
    return false;
  }

  /*
  Сохранение данных в кеш
  @param lat - широта для поиска смен
  @param lon - долгота для поиска смен
  @param data - данные для кеширования
   */
  async saveToCache(lat: number, lon: number, data: Shift[]) {
    try {
      const cacheKey = `shifts_${lat}_${lon}`;
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log('ShiftsStore: Data saved to cache');
    } catch (e) {
      console.error('ShiftsStore: Error saving to cache', e);
    }
  }

  /*
  Установка строки поиска
  @param query - поисковый запрос
   */
  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  /*
  Установка фильтров
  @param filters - объект с фильтрами
   */
  setFilters(filters: Partial<typeof this.filters>) {
    this.filters = { ...this.filters, ...filters };
  }

  /*
  Геттер для получения отфильтрованных и отсортированных смен
  @returns массив смен соответствующий поиску и фильтрам
   */
  get filteredItems() {
    let filtered = [...this.items];

    // Фильтр по поисковому запросу
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(shift =>
        shift.companyName.toLowerCase().includes(query) ||
        shift.address.toLowerCase().includes(query) ||
        shift.workTypes.some(workType =>
          workType.name.toLowerCase().includes(query)
        )
      );
    }

    // Фильтр по цене
    filtered = filtered.filter(shift =>
      shift.priceWorker >= this.filters.minPrice &&
      shift.priceWorker <= this.filters.maxPrice
    );

    // Фильтр по рейтингу
    if (this.filters.minRating > 0 && this.filters.minRating <= 5) {
      filtered = filtered.filter(shift =>
        shift.customerRating !== null &&
        shift.customerRating >= this.filters.minRating
      );
    }

    // Фильтр по типам работ
    if (this.filters.workTypes.length > 0) {
      filtered = filtered.filter(shift =>
        shift.workTypes.some(workType =>
          this.filters.workTypes.includes(workType.id)
        )
      );
    }

    return filtered;
  }

  /*
  Очистка всех данных и кеша
   */
  async clearAll() {
    this.items = [];
    this.selectedId = null;
    this.searchQuery = '';
    this.error = null;

    try {
      const keys = await AsyncStorage.getAllKeys();
      const shiftKeys = keys.filter(key => key.startsWith('shifts_'));
      await AsyncStorage.multiRemove(shiftKeys);
      console.log('ShiftsStore: All cache cleared');
    } catch (e) {
      console.error('ShiftsStore: Error clearing cache', e);
    }
  }
}

export default ShiftsStore;
