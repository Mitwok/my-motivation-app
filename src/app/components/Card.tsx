import React from "react";

interface CardProps {
  children: React.ReactNode; // Ожидаем вложенные компоненты
  className?: string; // Позволяет передавать дополнительные классы
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className=" border-solid border-2 border-cyan-100 transition-shadow shadow-sm shadow-cyan-500 hover:shadow-md hover:shadow-cyan-500 p-4 rounded-xl h-full">
      {/* <h2 className="text-2xl">Title</h2>
      <span>Description</span> */}
      <div className="overflow-y-auto h-96">{children}</div>
    </div>
  );
};

export default Card;
