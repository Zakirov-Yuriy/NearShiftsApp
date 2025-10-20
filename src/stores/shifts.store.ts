/*
MobX Store для управления состоянием списка смен
Отвечает за загрузку, хранение и выбор смен
 */
import { makeAutoObservable, runInAction } from 'mobx';
import { Shift } from '../types/shift';
import { apiService } from '../services/api';

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
}

export default ShiftsStore;
