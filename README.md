# NearShifts App

#Описание проекта

**NearShifts** — мобильное приложение для поиска ближайших смен работы с геолокацией. Приложение позволяет пользователям быстро находить актуальные вакансии в их районе с удобным интерфейсом и кешированием данных.

# Скриншоты приложения

<div align="center">

# Экран списка смен
![Экран загрузки](../NearShiftsApp/screenshots/one.png)

# Детали смены
![Экран списка смен ](screenshots/two.png)

# Экран загрузки и геолокации
![Детали смены ](screenshots/three.png)

</div>

# Ключевые возможности

- **Геолокация**: Автоматическое определение местоположения пользователя при первом запуске
- **Умная сортировка**: Отображение смен отсортированных по расстоянию (алгоритм Haversine)
- **Кеширование**: Данные о сменах хранятся в MobX store для мгновенного доступа
- **Детальная информация**: Полная информация о смене без повторных запросов к API
- **Адаптивный UI**: Современный интерфейс с поддержкой темной темы и анимаций
- **Обработка ошибок**: Грамотная обработка сетевых ошибок и отсутствия данных

# Стек технологий

| Framework                                                                                                 | Language                                                                                       | State Management                                                             | Navigation                                                                                                    | Permissions & Geo                                                                                                                                           | Linting & Formatting                                                                                                                                                        | Testing                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![React Native CLI](https://img.shields.io/badge/React%20Native%20CLI-61DAFB?logo=react\&logoColor=white) | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript\&logoColor=white) | ![MobX](https://img.shields.io/badge/MobX-FF9955?logo=mobx\&logoColor=white) | ![React Navigation](https://img.shields.io/badge/React%20Navigation-000000?logo=reactrouter\&logoColor=white) | ![Permissions](https://img.shields.io/badge/RN%20Permissions-4.0%2B-blueviolet) ![Geolocation](https://img.shields.io/badge/RN%20Geolocation-3.0%2B-008080) | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint\&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier\&logoColor=black) | ![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest\&logoColor=white) ![Testing Library](https://img.shields.io/badge/Testing%20Library-E33332?logo=testing-library\&logoColor=white) |


# Архитектура проекта

Проект построен с использованием современных архитектурных подходов:

- **Clean Architecture** — разделение на слои (UI, бизнес-логика, данные)
- **Feature-Sliced Design** — модульная организация кода по функциональным доменам
- **SOLID принципы** — для обеспечения качества и расширяемости кода
- **TypeScript** — строгая типизация всех компонентов и сервисов

# Структура проекта

```
src/
├── app/                    # Конфигурация приложения
│   ├── navigation/        # Навигация (React Navigation)
│   ├── providers/         # Провайдеры (MobX stores)
│   └── App.tsx           # Главный компонент приложения
├── components/            # Переиспользуемые UI компоненты
│   ├── UI/               # Базовые UI элементы
│   └── ShiftCard.tsx     # Карточка смены
├── screens/              # Экраны приложения
│   ├── ShiftListScreen.tsx    # Список смен
│   └── ShiftDetailsScreen.tsx # Детали смены
├── stores/               # MobX stores
│   ├── root.store.ts     # Корневой store
│   └── shifts.store.ts   # Store управления сменами
├── services/             # Бизнес-логика и API
│   ├── api.ts           # HTTP клиент
│   ├── location.ts      # Сервисы геолокации
│   └── distance.ts      # Расчет расстояний
├── types/               # TypeScript типы
├── lib/                 # Утилиты и хелперы
└── styles/              # Глобальные стили
```

# Предварительные требования

Перед запуском убедитесь, что у вас установлены:

- **Node.js** >= 18.0.0
- **npm** или **yarn**
- **Android Studio** (для эмулятора Android)
- **JDK** 11+
- **Git**


# Установка и запуск

# 1. Клонирование репозитория

```bash
git clone <repository-url>
cd NearShiftsApp
```

# 2. Установка зависимостей

```bash
npm install
# или
yarn install
```

# 3. Установка iOS зависимостей (macOS)

```bash
cd ios
pod install
cd ..
```

# 4. Запуск на платформах

# Android

```bash
# Сборка и запуск на устройстве/эмуляторе
npx react-native run-android

# Альтернативно, запуск только Metro bundler
npm start
# В другом терминале
npx react-native run-android
```



# Тестирование

Проект включает полный набор тестов с покрытием > 80%:

# апуск всех тестов

```bash
# Запуск всех тестов
npm test

# Запуск с покрытием кода
npm run test:coverage

# Запуск конкретного тестового файла
npx jest src/components/__tests__/ShiftCard.test.tsx

# Запуск в режиме наблюдения
npm run test:watch
```

# Структура тестов

- **Unit тесты** — тестирование отдельных функций и компонентов
- **Integration тесты** — тестирование взаимодействия компонентов
- **E2E тесты** — сквозное тестирование пользовательских сценариев

# Конфигурация тестирования

Тесты настроены с использованием:
- **Jest** — тестовый раннер
- **React Native Testing Library** — утилиты для тестирования RN компонентов
- **Mock сервисы** — моки для внешних зависимостей



# Доступные команды

```bash
# Запуск приложения
npm start                 # Metro bundler
npm run android          # Android
npm run ios             # iOS

# Тестирование
npm test                # Все тесты
npm run test:watch      # Режим наблюдения
npm run test:coverage   # С покрытием

# Линтинг и форматирование
npm run lint            # Проверка кода
npm run lint:fix        # Автоисправление
npm run format          # Форматирование кода

# Сборка
npm run build:android   # APK для Android
npm run build:ios       # IPA для iOS
```

# Формат API ответа

```json
{
  "data": [
    {
      "id": "string",
      "logo": "string",
      "coordinates": {
        "longitude": "number",
        "latitude": "number"
      },
      "address": "string",
      "companyName": "string",
      "dateStartByCity": "string",
      "timeStartByCity": "string",
      "timeEndByCity": "string",
      "currentWorkers": "number",
      "planWorkers": "number",
      "workTypes": [
        {
          "id": "number",
          "name": "string",
          "nameGt5": "string",
          "nameLt5": "string",
          "nameOne": "string"
        }
      ],
      "priceWorker": "number",
      "bonusPriceWorker": "number",
      "customerFeedbacksCount": "string",
      "customerRating": "number | null",
      "isPromotionEnabled": "boolean"
    }
  ],
  "status": "number"
}
```

#  Контакты

- **Разработчик**: Юрий
- **Email**: Zakcoyote@gmail.com 
- **Telegram**: @Zak_Yuri

---

⭐ Если проект вам понравился, поставьте звезду!
