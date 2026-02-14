export default function StatsCard({ title, value }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col items-start justify-center transition-all">
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
        {title}
      </p>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        {value}
      </h2>
    </div>
  );
}