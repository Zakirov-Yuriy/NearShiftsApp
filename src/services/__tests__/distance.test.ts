/*
Тесты для сервиса расчета расстояний
Проверяют корректность формулы Haversine для расчета расстояний между координатами
 */
import { calculateDistance } from '../distance';

describe('calculateDistance', () => {
  test('рассчитывает расстояние между близкими точками', () => {
    // Краснодарские координаты (примерно 1 км друг от друга)
    const lat1 = 45.039268;
    const lon1 = 38.987221;
    const lat2 = 45.048318;
    const lon2 = 38.987221;

    const distance = calculateDistance(lat1, lon1, lat2, lon2);

    // Расстояние должно быть примерно 1 км (с учетом точности формулы)
    expect(distance).toBeGreaterThan(0.9);
    expect(distance).toBeLessThan(1.1);
  });

  test('возвращает 0 для одинаковых координат', () => {
    const lat = 45.039268;
    const lon = 38.987221;

    const distance = calculateDistance(lat, lon, lat, lon);

    expect(distance).toBe(0);
  });

  test('рассчитывает расстояние между удаленными точками', () => {
    // Москва и Санкт-Петербург (примерно 635 км)
    const moscowLat = 55.7558;
    const moscowLon = 37.6176;
    const spbLat = 59.9343;
    const spbLon = 30.3351;

    const distance = calculateDistance(moscowLat, moscowLon, spbLat, spbLon);

    // Расстояние должно быть примерно 635 км с погрешностью
    expect(distance).toBeGreaterThan(600);
    expect(distance).toBeLessThan(670);
  });

  test('работает с отрицательными координатами', () => {
    // Точка в западном полушарии
    const distance = calculateDistance(0, 0, 0, -90);

    // Расстояние должно быть примерно 10000 км (четверть экватора)
    expect(distance).toBeGreaterThan(9000);
    expect(distance).toBeLessThan(11000);
  });

  test('работает с координатами в разных полушариях', () => {
    const distance = calculateDistance(45, 0, -45, 0);

    // Расстояние между 45°N и 45°S должно быть примерно 10000 км
    expect(distance).toBeGreaterThan(9000);
    expect(distance).toBeLessThan(11000);
  });
});
