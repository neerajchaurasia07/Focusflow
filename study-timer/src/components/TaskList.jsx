import { useState, useEffect } from "react";
import API from "../api/api";
import TaskItem from "./TaskItem";

export default function TaskList({ readOnly = false }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // 👉 Fetch tasks from backend
  useEffect(() => {
    API
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // 👉 Add task
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const res = await API.post("/tasks", {
        text: input.trim(),
      });
      setTasks([...tasks, res.data]); // new task append
      setInput("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // 👉 Toggle complete
  const toggleTask = async (id) => {
    if (readOnly) return;
    const task = tasks.find((t) => t._id === id);

    try {
      const res = await API.patch(
        `/tasks/${id}`,
        { completed: !task.completed }
      );

      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // 👉 Delete task
  const deleteTask = async (id) => {
    if (readOnly) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // 👉 Show only completed tasks in dashboard read-only mode
  const visibleTasks = readOnly
    ? tasks.filter((task) => task.completed)
    : tasks;

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {readOnly ? "Completed Tasks 📌" : "Tasks 📝"}
      </h3>

      {/* Show add input only when NOT read-only */}
      {!readOnly && (
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            placeholder="Enter a new task..."
          />

          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      )}

      {/* Task listing */}
      <div className="flex flex-col gap-2">
        {visibleTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            {readOnly ? "No completed tasks yet." : "No tasks yet."}
          </p>
        ) : (
          visibleTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              readOnly={readOnly}
            />
          ))
        )}
      </div>
    </div>
  );
}
