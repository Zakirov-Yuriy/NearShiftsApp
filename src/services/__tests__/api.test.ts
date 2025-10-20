/*
Тесты для API сервиса
Проверяют HTTP запросы к серверу и обработку ответов
 */
import { apiService } from '../api';

// Мокируем fetch
const mockFetch = jest.fn();
beforeAll(() => {
  // @ts-ignore
  global.fetch = mockFetch;
});

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('getShifts', () => {
    const mockApiResponse = {
      data: [
        {
          id: 'test-id',
          logo: 'test-logo-url',
          coordinates: { longitude: 38.987221, latitude: 45.039268 },
          address: 'Тестовый адрес',
          companyName: 'Тестовая компания',
          dateStartByCity: '20.10.2025',
          timeStartByCity: '08:00',
          timeEndByCity: '18:00',
          currentWorkers: 2,
          planWorkers: 5,
          workTypes: [{ id: 1, name: 'Разнорабочий' }],
          priceWorker: 2500,
          bonusPriceWorker: 0,
          customerFeedbacksCount: '10 отзывов',
          customerRating: 4.5,
          isPromotionEnabled: false,
        },
      ],
      status: 200,
    };

    test('успешно загружает данные смен', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse,
      });

      const result = await apiService.getShifts(45.039268, 38.987221);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=45.039268&longitude=38.987221',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        })
      );

      expect(result).toEqual(mockApiResponse);
    });

    test('формирует правильный URL с координатами', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], status: 200 }),
      });

      await apiService.getShifts(55.7558, 37.6176);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=55.7558&longitude=37.6176',
        expect.any(Object)
      );
    });

    test('обрабатывает HTTP ошибки', async () => {
      const errorResponse = {
        ok: false,
        status: 422,
        text: async () => '{"errors":{"longitude":["Поле должно иметь числовое значение"]},"status":422}',
      };

      mockFetch.mockResolvedValueOnce(errorResponse);

      await expect(apiService.getShifts(45.039268, 38.987221))
        .rejects
        .toThrow('HTTP error! status: 422');
    });

    test('обрабатывает сетевые ошибки', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.getShifts(45.039268, 38.987221))
        .rejects
        .toThrow('Network error');
    });

    test('обрабатывает пустой ответ API', async () => {
      const emptyResponse = {
        ok: true,
        json: async () => ({ data: [], status: 200 }),
      };

      mockFetch.mockResolvedValueOnce(emptyResponse);

      const result = await apiService.getShifts(45.039268, 38.987221);

      expect(result.data).toEqual([]);
    });

    test('использует правильные заголовки запроса', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], status: 200 }),
      });

      await apiService.getShifts(45.039268, 38.987221);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        })
      );
    });
  });
});
