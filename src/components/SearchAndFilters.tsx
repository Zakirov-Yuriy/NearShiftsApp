/*
Компонент поиска и фильтров для списка смен
Предоставляет интерфейс для поиска по тексту и фильтрации по различным критериям
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../app/providers/AppProviders';
import { Button } from './UI/Button';
import { Rating } from './UI/Rating';
import { ThemeToggle } from './UI/ThemeToggle';

const { width } = Dimensions.get('window');

/*
Пропсы компонента поиска и фильтров
 */
interface SearchAndFiltersProps {
  // Колбэк для применения фильтров
  onFiltersChange?: () => void;
}

/*
Компонент поиска и фильтров с поддержкой MobX наблюдения
@param props - пропсы компонента
 */
export const SearchAndFilters: React.FC<SearchAndFiltersProps> = observer(({ onFiltersChange }) => {
  const { shiftsStore, themeStore } = useStores();
  const { colors } = themeStore.currentTheme;

  // Локальное состояние для модального окна фильтров
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState(shiftsStore.filters);

  /*
  Обработчик изменения поискового запроса
  @param text - новый текст поиска
   */
  const handleSearchChange = (text: string) => {
    shiftsStore.setSearchQuery(text);
  };

  /*
  Открытие модального окна фильтров
   */
  const openFiltersModal = () => {
    setTempFilters({ ...shiftsStore.filters });
    setIsFiltersModalVisible(true);
  };

  /*
  Закрытие модального окна фильтров
   */
  const closeFiltersModal = () => {
    setIsFiltersModalVisible(false);
  };

  /*
  Применение фильтров
   */
  const applyFilters = () => {
    shiftsStore.setFilters(tempFilters);
    setIsFiltersModalVisible(false);
    onFiltersChange?.();
  };

  /*
  Сброс фильтров к значениям по умолчанию
   */
  const resetFilters = () => {
    const defaultFilters = {
      minPrice: 0,
      maxPrice: 10000,
      minRating: 0,
      workTypes: [] as number[],
    };
    setTempFilters(defaultFilters);
  };

  /*
  Обновление временных фильтров для цены
  @param field - поле для обновления ('minPrice' или 'maxPrice')
  @param value - новое значение
   */
  const updatePriceFilter = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = parseInt(value) || 0;
    setTempFilters(prev => ({
      ...prev,
      [field]: numValue,
    }));
  };

  /*
  Обновление временных фильтров для рейтинга
  @param rating - новый минимальный рейтинг
   */
  const updateRatingFilter = (rating: number) => {
    setTempFilters(prev => ({
      ...prev,
      minRating: rating,
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Заголовок с кнопкой переключения темы */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>NearShifts</Text>
        <ThemeToggle size="small" />
      </View>

      {/* Поле поиска */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Поиск по компаниям, адресам..."
          placeholderTextColor={colors.textMuted}
          value={shiftsStore.searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>

      {/* Кнопки действий */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          onPress={openFiltersModal}
        >
          <Text style={[styles.filterButtonText, { color: colors.surface }]}>Фильтры</Text>
        </TouchableOpacity>

        {shiftsStore.searchQuery && (
        <TouchableOpacity
          style={[
            styles.clearButton,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface
            }
          ]}
          onPress={() => handleSearchChange('')}
        >
          <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>Очистить</Text>
        </TouchableOpacity>
        )}
      </View>

      {/* Модальное окно фильтров */}
      <Modal
        visible={isFiltersModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.separator }]}>
            <TouchableOpacity onPress={closeFiltersModal}>
              <Text style={[styles.modalCloseButton, { color: colors.primary }]}>Отмена</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Фильтры</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={[styles.modalResetButton, { color: colors.primary }]}>Сбросить</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Фильтр по цене */}
            <View style={[styles.filterSection, { borderBottomColor: colors.separator }]}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Цена за смену</Text>

              <View style={styles.priceInputsContainer}>
                <View style={styles.priceInputContainer}>
                  <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>От</Text>
                  <TextInput
                    style={[styles.priceInput, { color: colors.text, borderColor: colors.border }]}
                    value={tempFilters.minPrice.toString()}
                    onChangeText={(value) => updatePriceFilter('minPrice', value)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={styles.priceInputContainer}>
                  <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>До</Text>
                  <TextInput
                    style={[styles.priceInput, { color: colors.text, borderColor: colors.border }]}
                    value={tempFilters.maxPrice.toString()}
                    onChangeText={(value) => updatePriceFilter('maxPrice', value)}
                    keyboardType="numeric"
                    placeholder="10000"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>
            </View>

            {/* Фильтр по рейтингу */}
            <View style={[styles.filterSection, { borderBottomColor: colors.separator }]}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Минимальный рейтинг</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={styles.ratingOption}
                    onPress={() => updateRatingFilter(rating)}
                  >
                    <Rating rating={rating} />
                    <Text style={[
                      styles.ratingText,
                      { color: tempFilters.minRating === rating ? colors.primary : colors.textSecondary }
                    ]}>
                      {rating}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Кнопки действий в модальном окне */}
            <View style={styles.modalActions}>
              <Button
                title="Применить"
                onPress={applyFilters}
                style={styles.applyButton}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalCloseButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalResetButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
    paddingBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  priceInputsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  ratingOption: {
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActions: {
    marginTop: 24,
    paddingTop: 16,
  },
  applyButton: {
    width: '100%',
  },
});

export default SearchAndFilters;
