import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import AddField from './components/AddField';
import Tasks from './components/Tasks';
import SearchFilter from './components/SearchFilter';
import { supabase } from './supabaseClient/supabaseClient';
import toast from 'react-hot-toast';

const App = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch all tasks sorted by due date/time
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('ToDo_List')
      .select('*')
      .order('duedate', { ascending: true })
      .order('duetime', { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error.message);
    } else {
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete task by ID
  const handleDelete = async (id) => {
    const { error } = await supabase.from('ToDo_List').delete().eq('id', id);
    if (error) {
      toast.error("Delete failed");
      console.error("Error:", error.message);
    } else {
      toast.success("Task deleted");
      fetchTasks();
    }
  };

  // Edit task data
  const handleEditData = async (id, updatedTask) => {
    const { error } = await supabase.from('ToDo_List').update(updatedTask).eq('id', id);
    if (error) {
      toast.error("Update failed");
      console.error("Error:", error.message);
    } else {
      toast.success("Task updated");
      fetchTasks();
    }
  };

  // Add new task
  const handleAddData = async (taskData) => {
    const { error } = await supabase.from('ToDo_List').insert([taskData]);
    if (error) {
      toast.error("Add failed");
      console.error("Error:", error.message);
    } else {
      toast.success("Task added");
      fetchTasks();
    }
  };

  // Mark task completed or uncompleted
  const isCompleted = async (id, current) => {
    const { error } = await supabase
      .from('ToDo_List')
      .update({ isCompleted: !current })
      .eq('id', id);
    if (error) {
      toast.error("Failed to update status");
      console.error("Error:", error.message);
    } else {
      fetchTasks();
    }
  };

  // Delete all tasks
  const ClearAll = async () => {
    const { error } = await supabase.from("ToDo_List").delete().neq("id", 0);
    if (error) {
      toast.error("Failed to clear");
      console.error("Error:", error.message);
    } else {
      toast.success("All tasks cleared");
      setTasks([]);
    }
  };

  // Filter helpers
  const fetchCompletedTasks = async () => {
    const { data, error } = await supabase.from('ToDo_List').select('*').eq('isCompleted', true);
    if (!error) setTasks(data);
  };

  const fetchUnCompletedTasks = async () => {
    const { data, error } = await supabase.from('ToDo_List').select('*').eq('isCompleted', false);
    if (!error) setTasks(data);
  };

  const fetchByPriority = async (priority) => {
    const { data, error } = await supabase.from("ToDo_List").select("*").eq("priority", priority);
    if (!error) setTasks(data);
  };

  const fetchTasksBySearch = async (query) => {
    const { data, error } = await supabase
      .from('ToDo_List')
      .select('*')
      .ilike("task", `%${query}%`);
    if (!error) setTasks(data);
  };

  
  return (
    <div>
      <Navbar />
      <AddField handleAddData={handleAddData} />
      <SearchFilter
        ClearAll={ClearAll}
        fetchCompletedTasks={fetchCompletedTasks}
        fetchUnCompletedTasks={fetchUnCompletedTasks}
        fetchTasks={fetchTasks}
        fetchByPriority={fetchByPriority}
        fetchTasksBySearch={fetchTasksBySearch}
      />
      <Tasks
        tasks={tasks}
        handleDelete={handleDelete}
        handleEditData={handleEditData}
        isCompleted={isCompleted}
      />
      
    </div>
  );
};

export default App;
