/*
Провайдеры приложения для управления состоянием
Создает контекст MobX stores и предоставляет доступ к ним компонентам
 */
import React from 'react';
import RootStore from '../../stores/root.store';
import { createContext, useContext } from 'react';


// Пропсы провайдера приложения
 
interface AppProvidersProps {
  // Дочерние компоненты, которые будут обернуты провайдером */
  children: React.ReactNode;
}

/*
Создаем экземпляр корневого store приложения
Содержит все MobX stores (shiftsStore и др.)
 */
const rootStore = new RootStore();


// Контекст для доступа к MobX stores из компонентов

export const storesContext = createContext(rootStore);

/*
Хук для получения доступа к MobX stores в компонентах
@returns корневой store с доступом ко всем хранилищам
 */
export const useStores = () => {
  return useContext(storesContext);
};

/*
Провайдер приложения, обертывающий дочерние компоненты контекстом stores
@param props - пропсы с дочерними компонентами
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <storesContext.Provider value={rootStore}>
      {children}
    </storesContext.Provider>
  );
};
