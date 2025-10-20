/*
Сервис для расчета расстояний между географическими координатами
Использует формулу Haversine для точного расчета расстояния по сфере
 */

/*
Рассчитывает расстояние между двумя точками на земной поверхности
Использует формулу Haversine для учета кривизны Земли
@param lat1 - широта первой точки в градусах
@param lon1 - долгота первой точки в градусах
@param lat2 - широта второй точки в градусах
@param lon2 - долгота второй точки в градусах
@returns расстояние между точками в километрах
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  // Радиус Земли в километрах (среднее значение)
  const R = 6371;

  // Разница координат в радианах
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Формула Haversine
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  // Центральный угол между точками
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Возвращаем расстояние в километрах
  return R * c;
};

/*
Преобразует угол из градусов в радианы
@param degrees - угол в градусах
@returns угол в радианах
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};
