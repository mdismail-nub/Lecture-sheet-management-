import { motion } from "motion/react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-navy-100 rounded-md ${className}`} />
  );
}

export function TableRowSkeleton({ columns }: { columns: number }) {
  return (
    <tr className="animate-pulse">
      <td colSpan={columns} className="px-10 py-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2 flex-grow">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </td>
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-navy-50 shadow-sm relative overflow-hidden animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-16" />
      </div>
    </div>
  );
}
