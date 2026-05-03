const SidebarSkeleton = () => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800 animate-pulse">
      <div className="p-4 pt-6 flex justify-between items-center">
        <div className="h-6 bg-gray-700 rounded w-20"></div>
        <div className="h-7 bg-gray-700 rounded w-14"></div>
      </div>
      <div className="flex-1 px-3 space-y-2 pt-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 bg-gray-800 rounded-lg w-full"></div>
        ))}
      </div>
    </div>
  );
};

export default SidebarSkeleton;
