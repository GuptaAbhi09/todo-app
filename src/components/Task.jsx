import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useForm } from 'react-hook-form';

const Task = ({ item, index, handleDelete, handleEditData, isCompleted }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (isEdited) {
      reset({
        task: item.task,
        duedate: item.duedate,
        duetime: item.duetime,
        priority: item.priority
      });
    }
  }, [isEdited, item, reset]);

  const handleSubmitEdit = async (data) => {
    const updatedData = {
      task: data.task,
      duedate: data.duedate,
      duetime: data.duetime,
      priority: data.priority,
    };
    await handleEditData(item.id, updatedData);
    setIsEdited(false);
    reset();
  };

  const handleEdit = () => setIsEdited(true);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-400 text-black";
      case "low": return "bg-green-400 text-black";
      default: return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <>
      {isEdited ? (
        <div className='p-5 mt-4 w-full'>
          <form onSubmit={handleSubmit(handleSubmitEdit)} className='flex flex-wrap md:flex-nowrap justify-center gap-4 md:gap-5'>
            <div className='w-full md:w-[35%] bg-white p-3 rounded-2xl shadow-md'>
              <input {...register('task')} className='w-full outline-none text-base p-2 rounded-md border border-gray-200' type="text" placeholder='Edit task' />
            </div>
            <div className='w-[48%] md:w-[17%] bg-white p-3 rounded-2xl shadow-md'>
              <label className='text-sm font-semibold text-gray-700 block mb-1'>Due date</label>
              <input {...register('duedate')} className='w-full outline-none text-sm p-2 rounded-md border border-gray-200' type="date" />
            </div>
            <div className='w-[48%] md:w-[15%] bg-white p-3 rounded-2xl shadow-md'>
              <label className='text-sm font-semibold text-gray-700 block mb-1'>Due time</label>
              <input {...register('duetime')} className='w-full outline-none text-sm p-2 rounded-md border border-gray-200' type="time" />
            </div>
            <div className='w-full md:w-[13%] bg-white p-3 rounded-2xl shadow-md'>
              <label className='text-sm font-semibold text-gray-700 block mb-1'>Priority</label>
              <select {...register('priority')} className='w-full outline-none text-sm p-2 rounded-md border border-gray-200 bg-white'>
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className='w-full md:w-auto flex items-end'>
              <input className='px-5 py-2 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-all cursor-pointer shadow-md' type="submit" value="Update" />
            </div>
          </form>
        </div>
      ) : (
        <div className='w-full md:w-[70%] bg-white shadow-md rounded-xl px-5 py-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3'>
          <div className='flex items-start md:items-center gap-4 w-full'>
            <p className='w-6 h-6 border rounded-full text-center text-sm font-semibold'>{index + 1}</p>
            <div className='flex flex-col w-full'>
              <p className={`text-lg font-semibold ${item.isCompleted ? 'line-through text-gray-400' : ''}`}>{item.task}</p>
              <div className='flex flex-wrap gap-2 text-xs mt-1 text-gray-600'>
                <span>📅 {item.duedate || 'N/A'}</span>
                <span>⏰ {item.duetime || 'N/A'}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3 text-lg self-end md:self-auto'>
            <input
              type="checkbox"
              className='cursor-pointer w-5 h-5 accent-blue-500'
              checked={item.isCompleted}
              onChange={() => isCompleted(item.id, item.isCompleted)}
            />
            <FaEdit
              onClick={handleEdit}
              className='cursor-pointer hover:text-blue-500 transition duration-200'
              title="Edit"
            />
            <MdDelete
              onClick={() => handleDelete(item.id)}
              className='cursor-pointer hover:text-red-500 transition duration-200'
              title="Delete"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Task;
