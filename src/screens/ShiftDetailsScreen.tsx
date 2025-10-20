import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../app/providers/AppProviders';
import { Rating } from '../components/UI/Rating';
import { formatPrice, formatWorkers, formatTime } from '../lib/formatters';

const ShiftDetailsScreen: React.FC = observer(() => {
  const { shiftsStore, themeStore } = useStores();
  const { colors } = themeStore.currentTheme;
  const shift = shiftsStore.selected;

  if (!shift) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Смена не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image source={{ uri: shift.logo }} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={[styles.companyName, { color: colors.text }]}>{shift.companyName}</Text>
          <Text style={[styles.address, { color: colors.textSecondary }]}>{shift.address}</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: 8, padding: 16, marginBottom: 16 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Дата и время</Text>
        <Text style={[styles.text, { color: colors.text }]}>{shift.dateStartByCity}</Text>
        <Text style={[styles.text, { color: colors.text }]}>{formatTime(shift.timeStartByCity, shift.timeEndByCity)}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: 8, padding: 16, marginBottom: 16 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Оплата</Text>
        <Text style={[styles.price, { color: colors.primary }]}>{formatPrice(shift.priceWorker)} за час</Text>
        {shift.bonusPriceWorker > 0 && (
          <Text style={[styles.bonus, { color: colors.success }]}>Бонус: {formatPrice(shift.bonusPriceWorker)}</Text>
        )}
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: 8, padding: 16, marginBottom: 16 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Работники</Text>
        <Text style={[styles.text, { color: colors.text }]}>{formatWorkers(shift.currentWorkers, shift.planWorkers)}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: 8, padding: 16, marginBottom: 16 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Рейтинг</Text>
        <Rating rating={shift.customerRating} />
        <Text style={[styles.reviews, { color: colors.textMuted }]}>Отзывов: {shift.customerFeedbacksCount}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: 8, padding: 16, marginBottom: 16 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Типы работ</Text>
        {shift.workTypes.map((workType: any) => (
          <Text key={workType.id} style={[styles.workType, { color: colors.text }]}>
            {workType.name}
          </Text>
        ))}
      </View>

      {shift.isPromotionEnabled && (
        <View style={[styles.promotion, { backgroundColor: colors.warning + '20', borderColor: colors.warning }]}>
          <Text style={[styles.promotionText, { color: colors.warning }]}>Акционная смена!</Text>
        </View>
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bonus: {
    fontSize: 16,
    marginTop: 4,
  },
  reviews: {
    fontSize: 14,
    marginTop: 4,
  },
  workType: {
    fontSize: 16,
    marginBottom: 4,
  },
  promotion: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  promotionText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ShiftDetailsScreen;
