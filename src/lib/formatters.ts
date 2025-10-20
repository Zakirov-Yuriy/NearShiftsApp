/*
Библиотека функций форматирования данных для отображения в UI
Преобразует сырые данные в пользовательский вид
 */

/*
Форматирование цены с добавлением валюты
@param price - сумма в рублях
@returns строка с ценой и символом рубля
 */
export const formatPrice = (price: number): string => {
  return `${price} ₽`;
};

/*
Форматирование рейтинга с обработкой отсутствующего значения
@param rating - числовой рейтинг или null
@returns строка с рейтингом или текстом по умолчанию
 */
export const formatRating = (rating: number | null): string => {
  return rating ? rating.toFixed(1) : 'Нет рейтинга';
};

/*
Форматирование количества работников в виде текущих/требуемых
@param current - текущее количество работников
@param plan - требуемое количество работников
@returns строка в формате "текущие/требуемые"
 */
export const formatWorkers = (current: number, plan: number): string => {
  return `${current}/${plan}`;
};

/*
Форматирование времени работы в виде диапазона
@param start - время начала работы
@param end - время окончания работы
@returns строка в формате "начало - конец"
 */
export const formatTime = (start: string, end: string): string => {
  return `${start} - ${end}`;
};

/*
Форматирование расстояния с округлением до десятых
@param distance - расстояние в километрах
@returns строка с расстоянием и единицей измерения
 */
export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(1)} км`;
};
