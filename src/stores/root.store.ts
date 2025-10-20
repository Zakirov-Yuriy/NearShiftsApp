/*
Корневой MobX Store приложения
Содержит ссылки на все остальные stores и управляет их жизненным циклом
 */
import { ShiftsStore } from './shifts.store';
import { ThemeStore } from './theme.store';
import { makeAutoObservable } from 'mobx';

/*
Корневой store, содержащий все хранилища приложения
Обеспечивает централизованный доступ к состоянию
 */
export class RootStore {
  // Хранилище данных о сменах
  shiftsStore: ShiftsStore;
  // Хранилище темы приложения
  themeStore: ThemeStore;

  constructor() {
    // Инициализируем хранилища
    this.shiftsStore = new ShiftsStore();
    this.themeStore = new ThemeStore();
    // Делаем весь store наблюдаемым для MobX
    makeAutoObservable(this);
  }

  /*
  Очистка ресурсов при уничтожении приложения
   */
  destroy() {
    this.themeStore.destroy();
  }
}

// Экспортируем корневой store как дефолтный экспорт
export default RootStore;
