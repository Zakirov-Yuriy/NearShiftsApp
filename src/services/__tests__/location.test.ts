/*
Тесты для сервиса геолокации
Проверяют работу с разрешениями и получение координат устройства
 */
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  requestLocationPermission,
  getCurrentLocation,
} from '../location';

// Мокируем модули
jest.mock('react-native-geolocation-service');
jest.mock('react-native-permissions');
jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid');

const mockedGeolocation = Geolocation as jest.Mocked<typeof Geolocation>;
const mockedPermissionsAndroid = PermissionsAndroid as jest.Mocked<typeof PermissionsAndroid>;

describe('requestLocationPermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('возвращает true при получении разрешения', async () => {
    mockedPermissionsAndroid.request.mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

    const result = await requestLocationPermission();

    expect(mockedPermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      expect.objectContaining({
        title: 'NearShifts Location Permission',
        message: expect.stringContaining('NearShifts needs access to your location'),
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      })
    );
    expect(result).toBe(true);
  });

  test('возвращает false при отказе в разрешении', async () => {
    mockedPermissionsAndroid.request.mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

    const result = await requestLocationPermission();

    expect(result).toBe(false);
  });

  test('возвращает false при ошибке запроса', async () => {
    mockedPermissionsAndroid.request.mockRejectedValue(new Error('Permission error'));

    const result = await requestLocationPermission();

    expect(result).toBe(false);
  });
});

describe('getCurrentLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('возвращает координаты при успешном получении позиции', async () => {
    const mockPosition = {
      coords: {
        latitude: 45.039268,
        longitude: 38.987221,
        accuracy: 10,
        altitude: 0,
        heading: 0,
        speed: 0,
        altitudeAccuracy: 0,
      },
      timestamp: Date.now(),
    };

    mockedGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const position = await getCurrentLocation();

    expect(mockedGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        forceLocationManager: false,
      })
    );

    expect(position.coords.latitude).toBe(45.039268);
    expect(position.coords.longitude).toBe(38.987221);
  });

  test('выбрасывает ошибку при неудачном получении позиции', async () => {
    const mockError = {
      code: 1,
      message: 'Location unavailable',
    };

    mockedGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error!(mockError);
    });

    await expect(getCurrentLocation()).rejects.toEqual(mockError);
  });

  test('использует правильные параметры геолокации', async () => {
    const mockPosition = {
      coords: {
        latitude: 0,
        longitude: 0,
        accuracy: 10,
        altitude: 0,
        heading: 0,
        speed: 0,
        altitudeAccuracy: 0,
      },
      timestamp: Date.now(),
    };

    mockedGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    await getCurrentLocation();

    expect(mockedGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      })
    );
  });
});
