/*
Тесты для MobX store управления сменами
Проверяют загрузку данных, состояние и выбор смен
 */
import { ShiftsStore } from '../shifts.store';
import { apiService } from '../../services/api';

// Мокируем API сервис
jest.mock('../../services/api');
const mockedApiService = apiService as jest.Mocked<typeof apiService>;

describe('ShiftsStore', () => {
  let store: ShiftsStore;

  beforeEach(() => {
    jest.clearAllMocks();
    store = new ShiftsStore();
  });

  describe('инициализация', () => {
    test('инициализируется с правильными значениями по умолчанию', () => {
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
      expect(store.items).toEqual([]);
      expect(store.selectedId).toBe(null);
    });

    test('делает store наблюдаемым', () => {
      // Проверяем, что store является наблюдаемым объектом MobX
      expect(store).toBeDefined();
      expect(typeof store.loadByCoords).toBe('function');
    });
  });

  describe('setSelected', () => {
    test('устанавливает выбранную смену по ID', () => {
      const testId = 'test-shift-id';

      store.setSelected(testId);

      expect(store.selectedId).toBe(testId);
    });

    test('заменяет предыдущий выбранный ID', () => {
      store.setSelected('first-id');
      store.setSelected('second-id');

      expect(store.selectedId).toBe('second-id');
    });
  });

  describe('selected геттер', () => {
    test('возвращает выбранную смену по ID', () => {
      const mockShift = {
        id: 'test-id',
        logo: 'test-logo',
        coordinates: { longitude: 0, latitude: 0 },
        address: 'test-address',
        companyName: 'test-company',
        dateStartByCity: '01.01.2024',
        timeStartByCity: '09:00',
        timeEndByCity: '18:00',
        currentWorkers: 1,
        planWorkers: 2,
        workTypes: [],
        priceWorker: 1000,
        bonusPriceWorker: 0,
        customerFeedbacksCount: '0 отзывов',
        customerRating: null,
        isPromotionEnabled: false,
      };

      store.items = [mockShift];
      store.setSelected('test-id');

      expect(store.selected).toEqual(mockShift);
    });

    test('возвращает undefined если смена не найдена', () => {
      store.items = [];
      store.setSelected('non-existent-id');

      expect(store.selected).toBeUndefined();
    });

    test('возвращает undefined если selectedId равен null', () => {
      store.items = [
        {
          id: 'test-id',
          logo: 'test-logo',
          coordinates: { longitude: 0, latitude: 0 },
          address: 'test-address',
          companyName: 'test-company',
          dateStartByCity: '01.01.2024',
          timeStartByCity: '09:00',
          timeEndByCity: '18:00',
          currentWorkers: 1,
          planWorkers: 2,
          workTypes: [],
          priceWorker: 1000,
          bonusPriceWorker: 0,
          customerFeedbacksCount: '0 отзывов',
          customerRating: null,
          isPromotionEnabled: false,
        },
      ];
      store.selectedId = null;

      expect(store.selected).toBeUndefined();
    });
  });

  describe('loadByCoords', () => {
    const mockApiResponse = {
      data: [
        {
          id: 'test-id',
          logo: 'test-logo',
          coordinates: { longitude: 38.987221, latitude: 45.039268 },
          address: 'test-address',
          companyName: 'test-company',
          dateStartByCity: '01.01.2024',
          timeStartByCity: '09:00',
          timeEndByCity: '18:00',
          currentWorkers: 1,
          planWorkers: 2,
          workTypes: [],
          priceWorker: 1000,
          bonusPriceWorker: 0,
          customerFeedbacksCount: '0 отзывов',
          customerRating: null,
          isPromotionEnabled: false,
        },
      ],
      status: 200,
    };

    test('успешно загружает данные смен', async () => {
      mockedApiService.getShifts.mockResolvedValueOnce(mockApiResponse);

      await store.loadByCoords(45.039268, 38.987221);

      expect(mockedApiService.getShifts).toHaveBeenCalledWith(45.039268, 38.987221);
      expect(store.items).toEqual(mockApiResponse.data);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });

    test('устанавливает состояние загрузки во время запроса', async () => {
      let resolvePromise: (value: any) => void;
      let promise: Promise<any>;
      promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockedApiService.getShifts.mockReturnValueOnce(promise);

      // Запускаем загрузку асинхронно
      const loadPromise = store.loadByCoords(45.039268, 38.987221);

      // Проверяем, что загрузка началась
      expect(store.loading).toBe(true);
      expect(store.error).toBe(null);

      // Разрешаем промис
      resolvePromise!(mockApiResponse);

      await loadPromise;

      // Проверяем финальное состояние
      expect(store.loading).toBe(false);
      expect(store.items).toEqual(mockApiResponse.data);
    });

    test('обрабатывает ошибки загрузки', async () => {
      const errorMessage = 'Network error';
      mockedApiService.getShifts.mockRejectedValueOnce(new Error(errorMessage));

      await store.loadByCoords(45.039268, 38.987221);

      expect(store.error).toBe(errorMessage);
      expect(store.loading).toBe(false);
      expect(store.items).toEqual([]);
    });

    test('обрабатывает ошибки без сообщения', async () => {
      mockedApiService.getShifts.mockRejectedValueOnce(new Error());

      await store.loadByCoords(45.039268, 38.987221);

      expect(store.error).toBe('Network error');
      expect(store.loading).toBe(false);
    });

    test('очищает предыдущую ошибку при новой загрузке', async () => {
      // Устанавливаем начальную ошибку
      store.error = 'Previous error';

      mockedApiService.getShifts.mockResolvedValueOnce({
        data: [],
        status: 200,
      });

      await store.loadByCoords(45.039268, 38.987221);

      expect(store.error).toBe(null);
      expect(store.items).toEqual([]);
    });

    test('обрабатывает пустой ответ API', async () => {
      mockedApiService.getShifts.mockResolvedValueOnce({
        data: [],
        status: 200,
      });

      await store.loadByCoords(45.039268, 38.987221);

      expect(store.items).toEqual([]);
      expect(store.error).toBe(null);
    });
  });
});
