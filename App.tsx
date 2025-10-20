/*
Главный компонент приложения NearShifts
Отвечает за получение геолокации и инициализацию навигации
 */
import React, { useEffect, useState } from 'react';
import { AppProviders } from './src/app/providers/AppProviders';
import { View, Text, StyleSheet } from 'react-native';
import { requestLocationPermission, getCurrentLocation } from './src/services/location';
import RootNavigator from './src/app/navigation/RootNavigator';

function App() {
  // Состояние для хранения координат пользователя
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  // Состояние разрешения на геолокацию
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    /**
    Функция получения геолокации пользователя
    Включает обработку разрешений и fallback на координаты Краснодара для тестирования
     */
    const getLocation = async () => {
      console.log('Starting location request...');
      const hasPermission = await requestLocationPermission();
      console.log('Location permission:', hasPermission);
      setPermissionGranted(hasPermission);

      if (hasPermission) {
        try {
          console.log('Getting current location...');
          const position = await getCurrentLocation();
          console.log('Location received:', position.coords);

          // Используем координаты Краснодара для тестирования вместо координат эмулятора
          console.log('Using Krasnodar coordinates for testing');
          setLocation({
            latitude: 45.039268,
            longitude: 38.987221,
          });
        } catch (error) {
          console.error('Location error:', error);
          // Fallback на координаты Краснодара при ошибке геолокации
          console.log('Using Krasnodar coordinates');
          setLocation({
            latitude: 45.039268,
            longitude: 38.987221,
          });
        }
      } else {
        // Fallback на координаты Краснодара при отказе в разрешении
        console.log('Using Krasnodar coordinates due to permission denied');
        setLocation({
          latitude: 45.039268,
          longitude: 38.987221,
        });
      }
    };

    getLocation();
  }, []);

  return (
    <AppProviders>
      {permissionGranted === null ? (
        <View style={styles.container}>
          <Text style={styles.text}>Запрос разрешения на геолокацию...</Text>
        </View>
      ) : permissionGranted === false ? (
        <View style={styles.container}>
          <Text style={styles.text}>Разрешение на геолокацию отклонено. Пожалуйста, предоставьте разрешение в настройках приложения.</Text>
        </View>
      ) : location ? (
        <RootNavigator latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>Определение местоположения...</Text>
        </View>
      )}
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default App;
