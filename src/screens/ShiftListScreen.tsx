/**
Экран списка смен
Отображает загруженные смены в виде списка карточек с поддержкой загрузки, ошибок, поиска и фильтров
 */
import React, { useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../app/providers/AppProviders';
import { ShiftCard } from '../components/ShiftCard';
import { Skeleton } from '../components/UI/Skeleton';
import { ErrorView } from '../components/UI/ErrorView';
import { SearchAndFilters } from '../components/SearchAndFilters';
import { ThemeToggle } from '../components/UI/ThemeToggle';
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
  const { shiftsStore, themeStore } = useStores();
  const { colors } = themeStore.currentTheme;

  // Загружаем данные при монтировании или изменении координат
  useEffect(() => {
    const loadData = async () => {
      console.log('ShiftListScreen: Loading shifts for coords', latitude, longitude);

      // Сначала пытаемся загрузить из кеша
      const cacheLoaded = await shiftsStore.loadFromCache(latitude, longitude);

      if (!cacheLoaded) {
        // Если кеш пуст или устарел, загружаем с сервера
        shiftsStore.loadByCoords(latitude, longitude);
      }
    };

    loadData();
  }, [latitude, longitude, shiftsStore]);

  // Обработчик pull-to-refresh
  const handleRefresh = useCallback(() => {
    shiftsStore.refreshData(latitude, longitude);
  }, [latitude, longitude, shiftsStore]);

  // Обработчик применения фильтров
  const handleFiltersChange = useCallback(() => {
    console.log('ShiftListScreen: Filters applied');
  }, []);

  console.log('ShiftListScreen: Render', {
    loading: shiftsStore.loading,
    refreshing: shiftsStore.refreshing,
    error: shiftsStore.error,
    itemsCount: shiftsStore.items.length,
    filteredCount: shiftsStore.filteredItems.length,
    searchQuery: shiftsStore.searchQuery,
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

  /*
  Рендер функция для пустого состояния с учетом фильтров
  @returns JSX элемент с сообщением о пустом результате
   */
  const renderEmpty = () => {
    const hasActiveFilters = shiftsStore.searchQuery.trim() ||
      shiftsStore.filters.minPrice > 0 ||
      shiftsStore.filters.maxPrice < 10000 ||
      shiftsStore.filters.minRating > 0 ||
      shiftsStore.filters.workTypes.length > 0;

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {hasActiveFilters ? 'По заданным фильтрам ничего не найдено' : 'Нет доступных смен'}
        </Text>
        {hasActiveFilters && (
          <TouchableOpacity
            style={[styles.clearFiltersButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              shiftsStore.setSearchQuery('');
              shiftsStore.setFilters({
                minPrice: 0,
                maxPrice: 10000,
                minRating: 0,
                workTypes: [],
              });
            }}
          >
            <Text style={[styles.clearFiltersText, { color: colors.surface }]}>Очистить фильтры</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Показываем скелетон только при первой загрузке
  if (shiftsStore.loading && shiftsStore.items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SearchAndFilters onFiltersChange={handleFiltersChange} />
        {renderSkeleton()}
      </View>
    );
  }

  // Показываем ошибку, если нет данных и произошла ошибка
  if (shiftsStore.error && shiftsStore.items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SearchAndFilters onFiltersChange={handleFiltersChange} />
        <ErrorView
          message={shiftsStore.error}
          onRetry={() => shiftsStore.loadByCoords(latitude, longitude)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Компонент поиска и фильтров */}
      <SearchAndFilters onFiltersChange={handleFiltersChange} />

      {/* Список смен с поддержкой pull-to-refresh */}
      {shiftsStore.filteredItems.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={shiftsStore.filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={shiftsStore.refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListFooterComponent={() => (
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                Найдено {shiftsStore.filteredItems.length} смен
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skeletonContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
});

export default ShiftListScreen;
