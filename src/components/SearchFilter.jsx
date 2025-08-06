import React, { useEffect, useState } from 'react'
import { IoSearch, IoFilter } from "react-icons/io5";

const SearchFilter = ({ ClearAll, fetchCompletedTasks, fetchUnCompletedTasks, fetchTasks, fetchByPriority, fetchTasksBySearch }) => {

  const handleStatus = (e) => {
    const value = e.target.value;
    if (value === "completed") fetchCompletedTasks();
    else if (value === "pending") fetchUnCompletedTasks();
    else fetchTasks();
  };

  const handlePriority = (e) => {
    const value = e.target.value;
    if (value === "all") fetchTasks();
    else fetchByPriority(value);
  };

  const [searchValue, setSearchValue] = useState("");
  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasksBySearch(searchValue);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <div className='w-full flex flex-wrap justify-center items-center px-7 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-5'>
      
      {/* Search Box */}
      <div className='flex items-center gap-2 bg-white p-2 px-4 rounded-full shadow-md w-[90%] sm:w-[60%] md:w-[40%]'>
        <IoSearch className='text-xl text-gray-500' />
        <input
          type='search'
          placeholder='Search task...'
          onChange={(e)=>setSearchValue(e.target.value)}
          value={searchValue}
          className='w-full outline-none bg-transparent text-sm md:text-base'
        />
      </div>

      {/* Priority Filter */}
      <div className='flex items-center gap-2 bg-white p-2 px-4 rounded-full shadow-md w-[40%] sm:w-[28%] md:w-[18%]'>
        <IoFilter className='text-xl text-gray-500' />
        <select className='w-full outline-none bg-transparent text-sm md:text-base' name="priority" onChange={handlePriority}>
          <option value="">Priority</option>
          <option value="low"> Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className='flex items-center gap-2 bg-white p-2 px-4 rounded-full shadow-md w-[40%] sm:w-[28%] md:w-[18%]'>
        <IoFilter className='text-xl text-gray-500' />
        <select className='w-full outline-none bg-transparent text-sm md:text-base' name="status" onChange={handleStatus}>
          <option value="">Status</option>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Clear All Button */}
      <button
        onClick={ClearAll}
        className='bg-red-100 hover:bg-red-200 text-red-600 font-semibold px-5 py-2 rounded-full text-sm md:text-base shadow-sm mt-2 sm:mt-0'
      >
        Clear All
      </button>
    </div>
  );
};

export default SearchFilter;
