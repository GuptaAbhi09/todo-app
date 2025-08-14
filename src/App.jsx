import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AddField from "./components/AddField";
import Tasks from "./components/Tasks";
import SearchFilter from "./components/SearchFilter";
import { supabase } from "./supabaseClient/supabaseClient";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user, isGuest } = useAuth();
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from DB if logged in
  const fetchTasks = async () => {
    if (!user) return; 
    const { data, error } = await supabase
      .from("ToDo_List")
      .select("*")
      .eq("user_id", user.id) // ✅ Only logged-in user's tasks
      .order("duedate", { ascending: true })
      .order("duetime", { ascending: true });

    if (!error) setTasks(data);
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else if (isGuest) {
      setTasks([]); // Guests start empty
    }
  }, [user, isGuest]);

  // Common functions (use Supabase for users, local state for guests)
  const handleAddData = async (taskData) => {
    if (isGuest) {
      setTasks((prev) => [...prev, { ...taskData, id: Date.now() }]);
      toast.success("Task added (Guest mode)");
    } else {
      const { error } = await supabase.from("ToDo_List").insert([
        {
          ...taskData,
          user_id: user.id, // ✅ Store current user's ID
        },
      ]);
      if (!error) {
        toast.success("Task added");
        fetchTasks();
      }
    }
  };

  const handleDelete = async (id) => {
    if (isGuest) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task deleted (Guest mode)");
    } else {
      const { error } = await supabase.from("ToDo_List").delete().eq("id", id);
      if (!error) {
        toast.success("Task deleted");
        fetchTasks();
      }
    }
  };

  const handleEditData = async (id, updatedTask) => {
    if (isGuest) {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
      );
      toast.success("Task updated (Guest mode)");
    } else {
      const { error } = await supabase
        .from("ToDo_List")
        .update(updatedTask)
        .eq("id", id);
      if (!error) {
        toast.success("Task updated");
        fetchTasks();
      }
    }
  };

  const isCompleted = async (id, current) => {
    if (isGuest) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, isCompleted: !current } : task
        )
      );
    } else {
      const { error } = await supabase
        .from("ToDo_List")
        .update({ isCompleted: !current })
        .eq("id", id);
      if (!error) fetchTasks();
    }
  };

  const ClearAll = async () => {
    if (isGuest) {
      setTasks([]);
      toast.success("All tasks cleared (Guest mode)");
    } else {
      const { error } = await supabase.from("ToDo_List").delete().neq("id", 0);
      if (!error) {
        toast.success("All tasks cleared");
        setTasks([]);
      }
    }
  };

  // Filters (only for DB users)
  const fetchCompletedTasks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ToDo_List")
      .select("*")
      .eq("user_id", user.id)
      .eq("isCompleted", true);
    if (!error) setTasks(data);
  };

  const fetchUnCompletedTasks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ToDo_List")
      .select("*")
      .eq("user_id", user.id)
      .eq("isCompleted", false);
    if (!error) setTasks(data);
  };

  const fetchByPriority = async (priority) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ToDo_List")
      .select("*")
      .eq("user_id", user.id)
      .eq("priority", priority);
    if (!error) setTasks(data);
  };

  const fetchTasksBySearch = async (query) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ToDo_List")
      .select("*")
      .eq("user_id", user.id)
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
