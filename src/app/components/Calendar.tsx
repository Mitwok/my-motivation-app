"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useCalendar } from "./contexts/CalendarContext";

interface SelectedDate {
  year: number;
  month: number;
  day: number;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<(number | null)[]>([]);
  const { selectedDate, setSelectedDate } = useCalendar();

  // Дни недели и месяцы на английском
  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const fullMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Количество дней в текущем месяце
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Первый день месяца (перевод с учетом понедельника как первого дня недели)
    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;

    // Создание массива дней с пустыми ячейками для выравнивания начала месяца
    const daysArray = [
      ...Array.from({ length: firstDayOfMonth }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    setDays(daysArray);

    // Установить текущий день как выбранный (по умолчанию)
    if (!selectedDate) {
      const today = new Date();
      setSelectedDate({
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate(),
      });
    }
  }, [currentDate, selectedDate]);

  const handleDayClick = (day: number | null) => {
    if (day) {
      setSelectedDate({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        day,
      });
    }
  };

  const handleMonthChange = (offset: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + offset,
        1
      );
      return newDate;
    });
  };

  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return (
      selectedDate.year === currentDate.getFullYear() &&
      selectedDate.month === currentDate.getMonth() &&
      selectedDate.day === day
    );
  };

  return (
    <div className="max-w-sm w-full">
      <div className="dark:bg-gray-800 bg-white rounded-t">
        <div className="px-4 flex items-center justify-between">
          <button
            onClick={() => handleMonthChange(-1)}
            aria-label="calendar backward"
            className="text-gray-800 dark:text-gray-100 p-2"
          >
            &lt;
          </button>
          <span className="text-base font-bold dark:text-gray-100 text-gray-800">
            {`${
              fullMonths[currentDate.getMonth()]
            } ${currentDate.getFullYear()}`}
          </span>
          <button
            onClick={() => handleMonthChange(1)}
            aria-label="calendar forward"
            className="ml-3 text-gray-800 dark:text-gray-100 p-2"
          >
            &gt;
          </button>
        </div>
        <div className="flex items-center justify-between pt-2 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {weekDays.map((day) => (
                  <th key={day}>
                    <div className="w-full flex justify-center py-2">
                      <p className="text-base font-medium text-gray-800 dark:text-gray-100">
                        {day}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from(
                { length: Math.ceil(days.length / 7) },
                (_, rowIndex) => (
                  <tr key={rowIndex}>
                    {days
                      .slice(rowIndex * 7, rowIndex * 7 + 7)
                      .map((day, index) => (
                        <td key={index} className="">
                          <div
                            onClick={() => handleDayClick(day)}
                            className={clsx(
                              "p-3 cursor-pointer flex w-full justify-center",
                              {
                                "bg-indigo-500 text-white rounded-full":
                                  isSelected(day),
                                "text-gray-500 dark:text-gray-100 font-medium":
                                  !isSelected(day),
                              }
                            )}
                          >
                            {day}
                          </div>
                        </td>
                      ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
