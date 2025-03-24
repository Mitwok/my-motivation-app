"use client";
import React, { useEffect, useState } from "react";

interface CompletedTasks {
  [date: string]: string[];
}

const OverallProgress: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks>({});

  // Функция для загрузки выполненных задач из localStorage
  const loadCompletedTasks = () => {
    const storedCompletedTasks = localStorage.getItem("completedTasks");
    setCompletedTasks(storedCompletedTasks ? JSON.parse(storedCompletedTasks) : {});
  };

  useEffect(() => {
    // Первоначальная загрузка
    loadCompletedTasks();

    // Слушаем событие обновления `localStorage` внутри вкладки
    const handleUpdate = () => {
      loadCompletedTasks();
    };

    window.addEventListener("completedTasksUpdated", handleUpdate);
    return () => window.removeEventListener("completedTasksUpdated", handleUpdate);
  }, []);

  // Пример расчёта общего прогресса
  const calculateOverallProgress = () => {
    const allTaskIds = Object.values(completedTasks).flat();
    return allTaskIds.length;
  };

  return (
    <div>
      <h2>Overall Progress</h2>
      <p>Completed Tasks: {calculateOverallProgress()}</p>
    </div>
  );
};

export default OverallProgress;