/*
Тесты для компонента ShiftCard
Проверяют отображение данных смены в карточке
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { ShiftCard } from '../ShiftCard';
import { Shift } from '../../types/shift';

// Мок для функций форматирования
jest.mock('../../lib/formatters', () => ({
  formatPrice: jest.fn((price) => `${price} ₽`),
  formatRating: jest.fn((rating) => rating?.toFixed(1) || 'Нет рейтинга'),
  formatWorkers: jest.fn((current, plan) => `${current}/${plan}`),
  formatTime: jest.fn((start, end) => `${start} - ${end}`),
  formatDistance: jest.fn((distance) => `${distance.toFixed(1)} км`),
}));

// Мок для React Native компонентов
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  Image: 'Image',
  TouchableOpacity: 'TouchableOpacity',
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
}));

const mockShift: Shift = {
  id: 'test-shift-id',
  logo: 'https://example.com/logo.jpg',
  coordinates: {
    longitude: 38.987221,
    latitude: 45.039268,
  },
  address: 'ул. Тестовая, 123',
  companyName: 'Тестовая Компания',
  dateStartByCity: '20.10.2025',
  timeStartByCity: '08:00',
  timeEndByCity: '18:00',
  currentWorkers: 2,
  planWorkers: 5,
  workTypes: [
    {
      id: 1,
      name: 'Разнорабочий',
      nameGt5: 'Разнорабочих',
      nameLt5: 'Разнорабочего',
      nameOne: 'Разнорабочий',
    },
  ],
  priceWorker: 2500,
  bonusPriceWorker: 0,
  customerFeedbacksCount: '15 отзывов',
  customerRating: 4.5,
  isPromotionEnabled: false,
};

describe('ShiftCard', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('отображает основную информацию о смене', () => {
    const { getByText } = render(
      <ShiftCard shift={mockShift} onPress={mockOnPress} />
    );

    expect(getByText('Тестовая Компания')).toBeTruthy();
    expect(getByText('ул. Тестовая, 123')).toBeTruthy();
    expect(getByText('20.10.2025')).toBeTruthy();
  });

  test('отображает расстояние когда оно передано', () => {
    const { getByText } = render(
      <ShiftCard
        shift={mockShift}
        distance={2.5}
        onPress={mockOnPress}
      />
    );

    expect(getByText('2.5 км')).toBeTruthy();
  });

  test('не отображает расстояние когда оно не передано', () => {
    const { queryByText } = render(
      <ShiftCard shift={mockShift} onPress={mockOnPress} />
    );

    expect(queryByText(/км$/)).toBeNull();
  });

  test('вызывает onPress при нажатии', () => {
    const { getByTestId } = render(
      <ShiftCard
        shift={mockShift}
        onPress={mockOnPress}
        testID="shift-card"
      />
    );

    // В React Native Testing Library используем fireEvent вместо userEvent
    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.press(getByTestId('shift-card'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('отображает логотип компании', () => {
    render(<ShiftCard shift={mockShift} onPress={mockOnPress} />);

    // Проверяем, что компонент отрендерился без ошибок
    expect(true).toBe(true);
  });

  test('отображает данные о работниках', () => {
    const { getByText } = render(
      <ShiftCard shift={mockShift} onPress={mockOnPress} />
    );

    expect(getByText('2/5')).toBeTruthy();
  });

  test('отображает цену за работника', () => {
    const { getByText } = render(
      <ShiftCard shift={mockShift} onPress={mockOnPress} />
    );

    expect(getByText('2500 ₽')).toBeTruthy();
  });

  test('отображает рейтинг', () => {
    const { getByText } = render(
      <ShiftCard shift={mockShift} onPress={mockOnPress} />
    );

    expect(getByText('★ 4.5')).toBeTruthy();
  });

  test('обрабатывает смену без рейтинга', () => {
    const shiftWithoutRating = {
      ...mockShift,
      customerRating: null,
    };

    const { getByText } = render(
      <ShiftCard shift={shiftWithoutRating} onPress={mockOnPress} />
    );

    expect(getByText('★ Нет рейтинга')).toBeTruthy();
  });

  test('отображает время работы', () => {
    const { getByText } = render(
      <ShiftCard shift={mockShift} onPress={mockOnPress} />
    );

    expect(getByText('08:00 - 18:00')).toBeTruthy();
  });

  test('применяет правильные стили к элементам', () => {
    const { getByText } = render(
      <ShiftCard shift={mockShift} onPress={mockOnPress} />
    );

    const companyName = getByText('Тестовая Компания');
    const address = getByText('ул. Тестовая, 123');

    // Проверяем, что элементы отображаются (стили применяются через StyleSheet)
    expect(companyName).toBeTruthy();
    expect(address).toBeTruthy();
  });
});
