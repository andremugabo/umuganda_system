import React from 'react';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/60 ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
    <div className="flex justify-between">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <Skeleton className="w-24 h-4" />
    </div>
    <div className="space-y-2">
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-2/3 h-4" />
    </div>
    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-16 h-8 rounded-xl" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-32 h-4" />
      </div>
      <Skeleton className="w-32 h-10 rounded-xl" />
    </div>
    <div className="flex-1 flex items-end gap-4 px-4 overflow-hidden">
      <Skeleton className="flex-1 h-[40%] rounded-t-lg" />
      <Skeleton className="flex-1 h-[70%] rounded-t-lg" />
      <Skeleton className="flex-1 h-[50%] rounded-t-lg" />
      <Skeleton className="flex-1 h-[90%] rounded-t-lg" />
      <Skeleton className="flex-1 h-[60%] rounded-t-lg" />
      <Skeleton className="flex-1 h-[80%] rounded-t-lg" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 py-4 px-2 border-b border-gray-50">
    <Skeleton className="w-10 h-10 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="w-1/4 h-4" />
      <Skeleton className="w-1/6 h-3" />
    </div>
    <Skeleton className="w-20 h-4" />
    <Skeleton className="w-16 h-8 rounded-lg" />
  </div>
);

export default Skeleton;
