'use client';

interface StatsOverviewProps {
  totalStations: number;
  totalBikes: number;
  totalDocks: number;
  activeStations: number;
  freeBikes: number;
}

export default function StatsOverview({
  totalStations,
  totalBikes,
  totalDocks,
  activeStations,
  freeBikes,
}: StatsOverviewProps) {
  const stats = [
    {
      label: 'Total Stations',
      value: totalStations,
      icon: '🚉',
      color: 'bg-purple-500',
    },
    {
      label: 'Active Stations',
      value: activeStations,
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      label: 'Available Bikes',
      value: totalBikes,
      icon: '🚲',
      color: 'bg-blue-500',
    },
    {
      label: 'Available Docks',
      value: totalDocks,
      icon: '🅿️',
      color: 'bg-orange-500',
    },
    {
      label: 'Free Vehicles',
      value: freeBikes,
      icon: '🛴',
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <div
              className={`w-3 h-3 rounded-full ${stat.color}`}
              title={stat.label}
            />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stat.value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
