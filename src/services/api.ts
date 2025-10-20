/*
Базовый URL для API запросов к сервису смен
Используется для получения списка доступных смен по координатам
 */
import { Shift } from '../types/shift';

const API_BASE_URL = 'https://mobile.handswork.pro/api/shifts/map-list-unauthorized';

export interface ApiResponse<T> {
  data: T;
  status: number;
}

/*
Сервис для работы с API
Содержит функции для HTTP запросов к серверу смен
 */
export const apiService = {
  /*
  Получение списка смен по географическим координатам
  @param latitude - широта для поиска смен
  @param longitude - долгота для поиска смен
  @returns Promise с массивом смен и статусом ответа
   */
  async getShifts(latitude: number, longitude: number): Promise<ApiResponse<Shift[]>> {
    try {
      // Формируем URL с параметрами координат
      const url = `${API_BASE_URL}?latitude=${latitude}&longitude=${longitude}`;
      console.log('API Request URL:', url);

      // Выполняем GET запрос к API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);

      // Обрабатываем ошибки HTTP
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      // Парсим JSON ответ
      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error: any) {
      console.error('API Error:', error.message || error);
      throw error;
    }
  },
};
