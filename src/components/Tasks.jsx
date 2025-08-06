import React from "react";
import Task from "./Task";

const Tasks = ({ tasks, handleDelete, handleEditData, isCompleted }) => {
  return (
    <div className="w-full flex flex-col items-center my-8 px-4 gap-4">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No tasks to display. Add one!</p>
      ) : (
        tasks.map((item, index) => (
          <Task
            key={item.id}
            item={item}
            index={index}
            handleDelete={handleDelete}
            handleEditData={handleEditData}
            isCompleted={isCompleted}
          />
        ))
      )}
    </div>
  );
};

export default Tasks;
