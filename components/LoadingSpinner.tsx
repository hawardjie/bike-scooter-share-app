export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
            🚲
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Loading bike share data...
        </p>
      </div>
    </div>
  );
}
