/**
Экран списка смен
Отображает загруженные смены в виде списка карточек с поддержкой загрузки и ошибок
 */
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../app/providers/AppProviders';
import { ShiftCard } from '../components/ShiftCard';
import { Skeleton } from '../components/UI/Skeleton';
import { ErrorView } from '../components/UI/ErrorView';
import { calculateDistance } from '../services/distance';
import { Shift } from '../types/shift';

/*
Пропсы экрана списка смен
 */
interface ShiftListScreenProps {
  // Широта для поиска и расчета расстояний */
  latitude: number;
  // Долгота для поиска и расчета расстояний */
  longitude: number;
}

/*
Экран списка смен с поддержкой MobX наблюдения
@param props - пропсы компонента с координатами
 */
const ShiftListScreen: React.FC<ShiftListScreenProps> = observer(({ latitude, longitude }) => {
  const navigation = useNavigation();
  const { shiftsStore } = useStores();

  useEffect(() => {
    console.log('ShiftListScreen: Loading shifts for coords', latitude, longitude);
    shiftsStore.loadByCoords(latitude, longitude);
  }, [latitude, longitude, shiftsStore]);

  console.log('ShiftListScreen: Render', {
    loading: shiftsStore.loading,
    error: shiftsStore.error,
    itemsCount: shiftsStore.items.length,
    items: shiftsStore.items
  });

  /*
  Рендер функция для элемента списка смен
  @param item - объект смены для отображения
  @returns JSX элемент карточки смены
   */
  const renderItem = ({ item }: { item: Shift }) => {
    console.log('ShiftListScreen: Rendering item', item.id);
    // Рассчитываем расстояние до смены по координатам
    const distance = calculateDistance(latitude, longitude, item.coordinates.latitude, item.coordinates.longitude);
    return (
      <ShiftCard
        shift={item}
        distance={distance}
        onPress={() => {
          // Устанавливаем выбранную смену в store
          shiftsStore.setSelected(item.id);
          // Переходим к экрану деталей смены
          navigation.navigate('ShiftDetails' as never);
        }}
      />
    );
  };

  /*
  Рендер функция для состояния загрузки (скелетон)
  @returns JSX элемент с анимированными заглушками
   */
  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <Skeleton width="90%" height={80} />
      <Skeleton width="90%" height={80} />
      <Skeleton width="90%" height={80} />
    </View>
  );

  if (shiftsStore.loading) {
    return renderSkeleton();
  }

  if (shiftsStore.error) {
    return <ErrorView message={shiftsStore.error} onRetry={() => shiftsStore.loadByCoords(latitude, longitude)} />;
  }

  return (
    <View style={styles.container}>
      {shiftsStore.items.length === 0 && !shiftsStore.loading && !shiftsStore.error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Нет доступных смен</Text>
        </View>
      ) : (
        <FlatList
          data={shiftsStore.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  skeletonContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ShiftListScreen;
