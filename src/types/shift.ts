/*
Типы данных для работы со сменами
Определяют структуру объектов смены и типов работ
 */


 //Тип работы, выполняемой на смене
 
export type WorkType = {
  // Уникальный идентификатор типа работы 
  id: number;
  // Название типа работы в именительном падеже
  name: string;
  // Название для множественного числа (> 5 работников)
  nameGt5: string;
  // Название для множественного числа (< 5 работников)
  nameLt5: string;
  // Название для единственного числа (1 работник)
  nameOne: string;
};

 //  Полная информация о смене
 
export type Shift = {
  // Уникальный идентификатор смены
  id: string;
  // URL логотипа компании
  logo: string;
  // Географические координаты места работы
  coordinates: {
    // Долгота
    longitude: number;
    // Широта
    latitude: number;
  };
  // Адрес места работы
  address: string;
  // Название компании-работодателя
  companyName: string;
  // Дата начала работы в формате города
  dateStartByCity: string;
  // Время начала работы
  timeStartByCity: string;
  // Время окончания работы
  timeEndByCity: string;
  // Текущее количество работников на смене
  currentWorkers: number;
  // Планируемое количество работников
  planWorkers: number;
  // Массив типов работ на смене
  workTypes: WorkType[];
  // Оплата за одного работника в день
  priceWorker: number;
  // Бонусная оплата за работника
  bonusPriceWorker: number;
  // Количество отзывов клиентов
  customerFeedbacksCount: string;
  // Средний рейтинг от клиентов
  customerRating: number | null;
  // Флаг включенной акции/промоушена
  isPromotionEnabled: boolean;
};
