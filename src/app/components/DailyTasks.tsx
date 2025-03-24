"use client";

import { useEffect, useState } from "react";
import { useCalendar } from "./contexts/CalendarContext";
import AddTaskModal from "./AddTaskModal";

interface Task {
  id: string;
  title: string;
  frequency: string | string[];
  startDate: string;
  endDate: string | null;
  requiredCompletions: number; // Необходимое количество выполнений
}

interface CompletedTasks {
  [date: string]: string[]; // дата: массив id выполненных задач
}

export default function DailyTasks() {
  const { selectedDate } = useCalendar();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks>({});

  // Добавление новой задачи
  const handleAddTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  // Загрузка задач и выполнений из Local Storage
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedCompletedTasks = localStorage.getItem("completedTasks");

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedCompletedTasks)
      setCompletedTasks(JSON.parse(storedCompletedTasks));
    window.dispatchEvent(new Event("completedTasksUpdated"));
  }, []);

  // Сохранение данных в Local Storage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  // Форматирование даты
  const formatDate = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;

  // Фильтрация задач по дате
  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];

    const currentDate = formatDate(
      selectedDate.year,
      selectedDate.month,
      selectedDate.day
    );

    return tasks.filter((task) => {
      const taskStartDate = new Date(task.startDate);
      const taskEndDate = task.endDate ? new Date(task.endDate) : null;
      const today = new Date(currentDate);

      if (today < taskStartDate) return false;
      if (taskEndDate && today > taskEndDate) return false;

      if (task.frequency === "everyday") return true;

      if (Array.isArray(task.frequency)) {
        const dayOfWeek = today.toLocaleDateString("en-US", {
          weekday: "short",
        });
        return task.frequency.includes(dayOfWeek);
      }

      if (
        typeof task.frequency === "string" &&
        task.frequency.startsWith("every")
      ) {
        const interval = parseInt(task.frequency.split(" ")[1]);
        const diffInDays = Math.floor(
          (today.getTime() - taskStartDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffInDays % interval === 0;
      }

      return false;
    });
  };

  // ✅ Вычисление прогресса задачи на основе выполнений
  const calculateTaskProgress = (
    taskId: string,
    requiredCompletions: number
  ) => {
    const allCompletions = Object.values(completedTasks)
      .flat()
      .filter((id) => id === taskId).length;

    const progress = (allCompletions / requiredCompletions) * 100;
    return Math.min(Math.round(progress), 100);
  };

  // Проверка выполнения задачи на сегодня
  const isTaskCompletedToday = (taskId: string) => {
    if (!selectedDate) return false;

    const currentDate = formatDate(
      selectedDate.year,
      selectedDate.month,
      selectedDate.day
    );
    return completedTasks[currentDate]?.includes(taskId) ?? false;
  };

  // Отметка задачи как выполненной
  const handleToggleTaskCompletion = (taskId: string) => {
    if (!selectedDate) return;

    const currentDate = formatDate(
      selectedDate.year,
      selectedDate.month,
      selectedDate.day
    );
    const isCompleted = isTaskCompletedToday(taskId);

    setCompletedTasks((prev) => {
      const updatedTasks = { ...prev };
      if (isCompleted) {
        updatedTasks[currentDate] = updatedTasks[currentDate].filter(
          (id) => id !== taskId
        );
        window.dispatchEvent(new Event("completedTasksUpdated"));
      } else {
        updatedTasks[currentDate] = [
          ...(updatedTasks[currentDate] || []),
          taskId,
        ];
        window.dispatchEvent(new Event("completedTasksUpdated"));
      }
      return updatedTasks;
    });
  };

  

  // Расчет общего прогресса на день
  const calculateDailyProgress = () => {
    if (!selectedDate) return 0; // Проверка на null

    const tasksForToday = getTasksForSelectedDate();
    if (tasksForToday.length === 0) return 0;

    const totalTasks = tasksForToday.length; // Общее количество задач на сегодня
    const completedTasksCount = tasksForToday.reduce((completedCount, task) => {
      const currentDate = formatDate(
        selectedDate.year,
        selectedDate.month,
        selectedDate.day
      );

      const isCompleted =
        completedTasks[currentDate]?.includes(task.id) || false;
      return completedCount + (isCompleted ? 1 : 0);
    }, 0);

    return Math.round((completedTasksCount / totalTasks) * 100);
  };
  const dailyProgress = calculateDailyProgress();
  const tasksForToday = getTasksForSelectedDate();

  

  return (
    <div>
      <h2>Tasks for the Day</h2>
      <AddTaskModal onAddTask={handleAddTask} />

      {selectedDate ? (
        <p>
          Selected Date: {selectedDate.month + 1}/{selectedDate.day}/
          {selectedDate.year}
        </p>
      ) : (
        <p>No date selected</p>
      )}
      {/* Общий прогресс за день */}
      <div className="mb-2">
        <strong>Daily Progress: {dailyProgress}%</strong>
        <div style={{ width: "100%", height: "10px", backgroundColor: "#ddd" }}>
          <div
            style={{
              width: `${dailyProgress}%`,
              height: "100%",
              backgroundColor: dailyProgress === 100 ? "green" : "orange",
            }}
          ></div>
        </div>
      </div>

      {tasksForToday.length > 0 ? (
        <ul>
          {tasksForToday.map((task) => {
            const progress = calculateTaskProgress(
              task.id,
              task.requiredCompletions
            );

            return (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={isTaskCompletedToday(task.id)}
                    onChange={() => handleToggleTaskCompletion(task.id)}
                  />
                  {task.title} — {progress}% выполнено
                </label>
                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    backgroundColor: "#ddd",
                    marginTop: "5px",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      backgroundColor: progress === 100 ? "green" : "orange",
                    }}
                  ></div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No tasks for this day.</p>
      )}
    </div>
  );

  
}
