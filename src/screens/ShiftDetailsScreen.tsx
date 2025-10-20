import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../app/providers/AppProviders';
import { Rating } from '../components/UI/Rating';
import { formatPrice, formatWorkers, formatTime } from '../lib/formatters';

const ShiftDetailsScreen: React.FC = observer(() => {
  const { shiftsStore } = useStores();
  const shift = shiftsStore.selected;

  if (!shift) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Смена не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: shift.logo }} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.companyName}>{shift.companyName}</Text>
          <Text style={styles.address}>{shift.address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Дата и время</Text>
        <Text style={styles.text}>{shift.dateStartByCity}</Text>
        <Text style={styles.text}>{formatTime(shift.timeStartByCity, shift.timeEndByCity)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Оплата</Text>
        <Text style={styles.price}>{formatPrice(shift.priceWorker)} за час</Text>
        {shift.bonusPriceWorker > 0 && (
          <Text style={styles.bonus}>Бонус: {formatPrice(shift.bonusPriceWorker)}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Работники</Text>
        <Text style={styles.text}>{formatWorkers(shift.currentWorkers, shift.planWorkers)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Рейтинг</Text>
        <Rating rating={shift.customerRating} />
        <Text style={styles.reviews}>Отзывов: {shift.customerFeedbacksCount}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Типы работ</Text>
        {shift.workTypes.map((workType: any) => (
          <Text key={workType.id} style={styles.workType}>
            {workType.name}
          </Text>
        ))}
      </View>

      {shift.isPromotionEnabled && (
        <View style={styles.promotion}>
          <Text style={styles.promotionText}>Акционная смена!</Text>
        </View>
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  bonus: {
    fontSize: 16,
    color: '#28a745',
    marginTop: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  workType: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  promotion: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  promotionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ShiftDetailsScreen;
