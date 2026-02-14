export default function TaskItem({ task, toggleTask, deleteTask, readOnly = false }) {
  return (
    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
      
      <div className="flex items-center gap-3">

        {/* Hide checkbox in read-only mode */}
        {!readOnly && (
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task._id)}
            className="h-5 w-5 cursor-pointer accent-blue-600"
          />
        )}

        <span
          className={`text-lg dark:text-white transition-all ${
            task.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {task.text}
        </span>
      </div>

      {/* Hide delete button in read-only mode */}
      {!readOnly && (
        <button
          onClick={() => deleteTask(task._id)}
          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
        >
          Delete
        </button>
      )}
    </div>
  );
}
