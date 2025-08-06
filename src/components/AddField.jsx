import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const AddField = ({ handleAddData }) => {
  const { register, handleSubmit, reset } = useForm();

  const handleSubmitForm = async (formData) => {
    const payload = {
      task: formData.task,
      duedate: formData.duedate,
      duetime: formData.duetime,
      priority: formData.priority,
    };

    await handleAddData(payload);
    reset();
  };

  return (
    <div className="p-5 mt-4 w-full">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="w-full flex flex-wrap md:flex-nowrap justify-center gap-4 md:gap-5"
      >
        {/* Task input */}
        <div className="flex flex-col w-full md:w-1/3 bg-white p-3 rounded-2xl shadow-md">
          <label className="text-sm font-semibold text-gray-700 mb-1">Task</label>
          <input
            {...register('task')}
            className="w-full outline-none text-base p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-400"
            required
            type="text"
            placeholder="Add task"
          />
        </div>

        {/* Due date */}
        <div className="flex flex-col w-[48%] md:w-[17%] bg-white p-3 rounded-2xl shadow-md">
          <label className="text-sm font-semibold text-gray-700 mb-1">Due date</label>
          <input
            {...register('duedate')}
            className="outline-none text-sm p-2 rounded-md border border-gray-200"
            type="date"
            required
          />
        </div>

        {/* Due time */}
        <div className="flex flex-col w-[48%] md:w-[15%] bg-white p-3 rounded-2xl shadow-md">
          <label className="text-sm font-semibold text-gray-700 mb-1">Due time</label>
          <input
            {...register('duetime')}
            className="outline-none text-sm p-2 rounded-md border border-gray-200"
            type="time"
          />
        </div>

        {/* Priority */}
        <div className="flex flex-col w-full md:w-[13%] bg-white p-3 rounded-2xl shadow-md">
          <label className="text-sm font-semibold text-gray-700 mb-1">Priority</label>
          <select
            {...register('priority')}
            className="w-full outline-none text-sm p-2 rounded-md border border-gray-200 bg-white"
            required
          >
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Submit button */}
        <div className="w-full md:w-auto flex items-end">
          <input
            className="px-6 py-2 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-all duration-200 cursor-pointer shadow-md"
            type="submit"
            value="Add Task"
          />
        </div>
      </form>
    </div>
  );
};

export default AddField;
