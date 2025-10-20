/*
Сервис для работы с геолокацией устройства
Отвечает за запрос разрешений и получение текущих координат
 */
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

/*
Запрос разрешения на доступ к точной геолокации
Показывает диалог пользователю с объяснением необходимости доступа
@returns Promise<boolean> - true если разрешение получено
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'NearShifts Location Permission',
        message:
          'NearShifts needs access to your location ' +
          'so you can see nearby shifts.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

/*
Получение текущих координат устройства
Использует высокую точность и включает обработку ошибок
@returns Promise с позицией устройства (координаты, точность и т.д.)
 */
export const getCurrentLocation = (): Promise<Geolocation.GeoPosition> => {
  return new Promise((resolve, reject) => {
    console.log('Requesting current position...');
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Position received successfully:', position.coords);
        resolve(position);
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      {
        // Включаем высокую точность для более точного определения местоположения
        enableHighAccuracy: true,
        // Таймаут запроса 15 секунд
        timeout: 15000,
        // Максимальный возраст кешированных данных 10 секунд
        maximumAge: 10000,
        // Принудительный запрос новой позиции
        forceRequestLocation: true,
        // Использовать системный менеджер геолокации
        forceLocationManager: false
      }
    );
  });
};
