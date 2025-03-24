"use client";
import React, { createContext, useContext, useState } from "react";

// Тип данных для выбранного дня
interface SelectedDate {
  year: number;
  month: number;
  day: number;
}

// Тип контекста
interface CalendarContextType {
  selectedDate: SelectedDate | null;
  setSelectedDate: (date: SelectedDate) => void;
}

// Создаем контекст
const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

// Провайдер контекста
export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);

  return (
    <CalendarContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </CalendarContext.Provider>
  );
};

// Хук для использования контекста
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
