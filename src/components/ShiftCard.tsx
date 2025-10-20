/*
Компонент карточки смены
Отображает основную информацию о смене в виде интерактивной карточки
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../app/providers/AppProviders';
import { Shift } from '../types/shift';
import { formatPrice, formatRating, formatWorkers, formatTime, formatDistance } from '../lib/formatters';


 // Пропсы компонента ShiftCard
 
interface ShiftCardProps {
  /** Объект смены с полной информацией */
  shift: Shift;
  /** Расстояние до смены в километрах (опционально) */
  distance?: number;
  /** Функция обработчик нажатия на карточку */
  onPress: () => void;
  /** Test ID для тестирования */
  testID?: string;
}

/*
Компонент карточки смены
Отображает основную информацию о смене в виде интерактивной карточки
 */
export const ShiftCard: React.FC<ShiftCardProps> = observer(({ shift, distance, onPress, testID }) => {
  const { themeStore } = useStores();
  const { colors } = themeStore.currentTheme;

  console.log('ShiftCard: Rendering shift', shift.id, shift.companyName);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      testID={testID}
    >
      <View style={styles.header}>
        <Image source={{ uri: shift.logo }} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={[styles.companyName, { color: colors.text }]}>{shift.companyName}</Text>
          <Text style={[styles.address, { color: colors.textSecondary }]}>{shift.address}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={[styles.date, { color: colors.text }]}>{shift.dateStartByCity}</Text>
        <Text style={[styles.time, { color: colors.text }]}>{formatTime(shift.timeStartByCity, shift.timeEndByCity)}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>{formatPrice(shift.priceWorker)}</Text>
        <Text style={[styles.workers, { color: colors.textMuted }]}>{formatWorkers(shift.currentWorkers, shift.planWorkers)}</Text>
        <Text style={[styles.rating, { color: colors.warning }]}>★ {formatRating(shift.customerRating)}</Text>
        {distance && <Text style={[styles.distance, { color: colors.textMuted }]}>{formatDistance(distance)}</Text>}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
  },
  time: {
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workers: {
    fontSize: 14,
  },
  rating: {
    fontSize: 14,
  },
  distance: {
    fontSize: 14,
  },
});
