"use client";
import { useState } from "react";
import Modal from "./Modal";
import AddTaskForm from "./AddTaskFrom";

interface AddTaskModalProps {
  onAddTask: (task: any) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onAddTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal}>Add New Task</button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddTaskForm onAddTask={onAddTask} onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default AddTaskModal;
