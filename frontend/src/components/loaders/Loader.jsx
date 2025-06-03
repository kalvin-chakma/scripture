import React from "react";

const Loader = () => {
  return (
    <div className="px-6 lg:px-0 mt-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center  mb-10">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded-md w-64 animate-pulse mb-1"></div>

        <div className="h-2 bg-gray-200 rounded-md w-80 animate-pulse mt-2"></div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-11/12 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
