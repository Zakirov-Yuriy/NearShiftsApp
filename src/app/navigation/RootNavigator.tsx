/*
Корневой навигатор приложения
Управляет навигацией между экранами списка и деталей смен
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
Корневой навигатор приложения с настройкой навигации
@param props - пропсы с координатами пользователя
 */
const RootNavigator: React.FC<RootNavigatorProps> = ({ latitude, longitude }) => {
  console.log('RootNavigator: Rendering with coords', latitude, longitude);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ShiftList">
        <Stack.Screen
          name="ShiftList"
          options={{ title: 'Смены рядом' }}
        >
          {() => <ShiftListScreen latitude={latitude} longitude={longitude} />}
        </Stack.Screen>
        <Stack.Screen
          name="ShiftDetails"
          component={ShiftDetailsScreen}
          options={{ title: 'Детали смены' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
