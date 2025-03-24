"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

interface AddTaskFormProps {
  onAddTask: (task: Task) => void;
  onClose: () => void;
}

interface Task {
  id: string;
  title: string;
  frequency: string | string[];
  startDate: string;
  endDate: string | null;
  requiredCompletions: number; // Необходимое количество выполнений
}

const calculateRequiredCompletions = (
  frequency: string | string[],
  startDate: string,
  endDate: string | null
) => {
  if (!endDate) return 0; // Бессрочная задача

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (frequency === "everyday") {
    return diffDays;
  }

  if (Array.isArray(frequency)) {
    const fullWeeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;
    return (
      fullWeeks * frequency.length + frequency.slice(0, remainingDays).length
    );
  }

  if (typeof frequency === "string" && frequency.startsWith("every")) {
    const interval = parseInt(frequency.split(" ")[1]);
    return Math.ceil(diffDays / interval);
  }

  return 0;
};

const daysOfWeek = [
  { label: "Mon", value: "Mon" },
  { label: "Tue", value: "Tue" },
  { label: "Wed", value: "Wed" },
  { label: "Thu", value: "Thu" },
  { label: "Fri", value: "Fri" },
  { label: "Sat", value: "Sat" },
  { label: "Sun", value: "Sun" },
];

const AddTaskForm = ({ onAddTask, onClose }: AddTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isEveryday, setIsEveryday] = useState(false);
  const [customInterval, setCustomInterval] = useState("");
  const [startDate, setStartDate] = useState<string>(() =>
    format(new Date(), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState("");
  const [isEndless, setIsEndless] = useState(false);

  const handleDayChange = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title ||
      (!isEveryday && selectedDays.length === 0 && !customInterval)
    ) {
      alert("Заполните название задачи и выберите частоту.");
      return;
    }
    const finalFrequency =
      selectedDays.length === 7 ? "everyday" : selectedDays;

    const frequency = isEveryday
      ? "everyday"
      : customInterval
      ? `every ${customInterval}`
      : selectedDays;

    const calculatedCompletions = calculateRequiredCompletions(
      frequency,
      startDate,
      isEndless ? null : endDate
    );

    const newTask: Task = {
      id: uuidv4(),
      title,
      frequency: finalFrequency,
      startDate,
      endDate: isEndless ? null : endDate,
      requiredCompletions: calculatedCompletions,
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="modal">
      <h2>Добавить новую задачу</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название задачи:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Дата начала:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Дата окончания:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isEndless}
          />
          <label>
            <input
              type="checkbox"
              checked={isEndless}
              onChange={() => setIsEndless(!isEndless)}
            />
            Без срока окончания
          </label>
        </div>

        <div>
          <label>Дни недели:</label>
          <div>
            {daysOfWeek.map((day) => (
              <label key={day.value} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day.value)}
                  onChange={() => {
                    const updatedDays = selectedDays.includes(day.value)
                      ? selectedDays.filter((d) => d !== day.value) // Убираем день
                      : [...selectedDays, day.value]; // Добавляем день

                    setSelectedDays(updatedDays);

                    // Сбрасываем "ежедневно" и интервал
                    setIsEveryday(false);
                    setCustomInterval(""); // Сбрасываем интервал
                  }}
                />
                {day.label}
              </label>
            ))}
          </div>
        </div>

        {/* Переключатель "Ежедневно" */}
        <label style={{ display: "block", marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={isEveryday}
            onChange={() => {
              setIsEveryday(!isEveryday);
              if (!isEveryday) {
                setSelectedDays(daysOfWeek.map((day) => day.value)); // Отметить все дни
                setCustomInterval("");
              } else {
                setSelectedDays([]); // Сбросить выбор
              }
            }}
          />
          Ежедневно
        </label>

        {/* Поле для выбора интервала */}
        <div>
          <label>Интервал (каждые X дней):</label>
          <input
            type="number"
            min="1"
            value={customInterval}
            onChange={(e) => {
              setCustomInterval(e.target.value);
              setSelectedDays([]); // Сбрасываем выбор дней
              setIsEveryday(false); // Сбрасываем "ежедневно"
            }}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <button type="submit">Добавить задачу</button>
          <button
            type="button"
            onClick={onClose}
            style={{ marginLeft: "10px" }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;
