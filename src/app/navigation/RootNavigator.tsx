/*
Корневой навигатор приложения
Управляет навигацией между экранами списка и деталей смен
 */
import React from 'react';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useStores } from '../providers/AppProviders';
import ShiftListScreen from '../../screens/ShiftListScreen';
import ShiftDetailsScreen from '../../screens/ShiftDetailsScreen';


// Типы параметров для навигации в приложении
 
export type RootStackParamList = {
  ShiftList: { latitude: number; longitude: number };
  ShiftDetails: undefined;
};


 // Стековый навигатор для управления экранами

const Stack = createNativeStackNavigator<RootStackParamList>();


 // Пропсы корневого навигатора

interface RootNavigatorProps {
  // Широта текущего местоположения пользователя
  latitude: number;
  // Долгота текущего местоположения пользователя */
  longitude: number;
}

/*
Корневой навигатор приложения с настройкой навигации и поддержкой тем
@param props - пропсы с координатами пользователя
 */
const RootNavigator: React.FC<RootNavigatorProps> = observer(({ latitude, longitude }) => {
  const { themeStore } = useStores();
  const { colors } = themeStore.currentTheme;

  console.log('RootNavigator: Rendering with coords', latitude, longitude);

  // Создаем тему для навигатора с правильной типизацией
  const navigationTheme: Theme = {
    dark: themeStore.currentTheme.isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '600',
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '700',
      },
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="ShiftList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      >
        <Stack.Screen
          name="ShiftList"
          options={{
            title: 'Смены рядом',
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
          }}
        >
          {() => <ShiftListScreen latitude={latitude} longitude={longitude} />}
        </Stack.Screen>
        <Stack.Screen
          name="ShiftDetails"
          component={ShiftDetailsScreen}
          options={{
            title: 'Детали смены',
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default RootNavigator;
