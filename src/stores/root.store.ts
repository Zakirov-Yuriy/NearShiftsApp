/*
Корневой MobX Store приложения
Содержит ссылки на все остальные stores и управляет их жизненным циклом
 */
import { ShiftsStore } from './shifts.store';
import { makeAutoObservable } from 'mobx';

/*
Корневой store, содержащий все хранилища приложения
Обеспечивает централизованный доступ к состоянию
 */
export class RootStore {
  // Хранилище данных о сменах 
  shiftsStore: ShiftsStore;

  constructor() {
    // Инициализируем хранилища
    this.shiftsStore = new ShiftsStore();
    // Делаем весь store наблюдаемым для MobX
    makeAutoObservable(this);
  }
}

// Экспортируем корневой store как дефолтный экспорт
export default RootStore;
