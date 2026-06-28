import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-gray-200", className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-8 border border-gray-100 shadow-sm h-48">
      <Skeleton className="w-12 h-12 mb-6" />
      <Skeleton className="w-24 h-4 mb-2" />
      <Skeleton className="w-32 h-8" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 px-8 border-b border-gray-100">
      <Skeleton className="w-12 h-12" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-1/4 h-3" />
      </div>
      <Skeleton className="w-24 h-6" />
    </div>
  );
}
