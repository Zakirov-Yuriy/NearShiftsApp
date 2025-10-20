/*
Тесты для функций форматирования данных
Проверяют корректность преобразования сырых данных в пользовательский вид
 */
import {
  formatPrice,
  formatRating,
  formatWorkers,
  formatTime,
  formatDistance,
} from '../formatters';

describe('formatPrice', () => {
  test('форматирует цену с рублем', () => {
    expect(formatPrice(2500)).toBe('2500 ₽');
    expect(formatPrice(0)).toBe('0 ₽');
    expect(formatPrice(1000000)).toBe('1000000 ₽');
  });
});

describe('formatRating', () => {
  test('форматирует положительный рейтинг', () => {
    expect(formatRating(4.5)).toBe('4.5');
    expect(formatRating(5.0)).toBe('5.0');
    expect(formatRating(3.14)).toBe('3.1');
  });

  test('обрабатывает null рейтинг', () => {
    expect(formatRating(null)).toBe('Нет рейтинга');
  });

  test('форматирует нулевой рейтинг', () => {
    expect(formatRating(0)).toBe('Нет рейтинга');
  });
});

describe('formatWorkers', () => {
  test('форматирует количество работников', () => {
    expect(formatWorkers(2, 5)).toBe('2/5');
    expect(formatWorkers(0, 10)).toBe('0/10');
    expect(formatWorkers(10, 10)).toBe('10/10');
  });
});

describe('formatTime', () => {
  test('форматирует время работы', () => {
    expect(formatTime('08:00', '18:00')).toBe('08:00 - 18:00');
    expect(formatTime('09:00', '17:00')).toBe('09:00 - 17:00');
  });
});

describe('formatDistance', () => {
  test('форматирует расстояние с округлением', () => {
    expect(formatDistance(1.234)).toBe('1.2 км');
    expect(formatDistance(0.001)).toBe('0.0 км');
    expect(formatDistance(10.567)).toBe('10.6 км');
  });

  test('форматирует целые числа', () => {
    expect(formatDistance(5)).toBe('5.0 км');
  });
});
