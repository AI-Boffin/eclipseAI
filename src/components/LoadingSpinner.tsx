import React from 'react';
import { Skeleton, CardSkeleton, TableSkeleton, ListSkeleton } from './Skeleton';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'spinner' | 'skeleton' | 'card' | 'table' | 'list';
  count?: number;
  rows?: number;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  type = 'spinner',
  count = 3,
  rows = 5
}: LoadingSpinnerProps) {
  // Use skeleton loading for better UX
  if (type === 'skeleton') {
    return <Skeleton className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'} ${className}`} rounded="full" />;
  }

  if (type === 'card') {
    return <CardSkeleton />;
  }

  if (type === 'table') {
    return <TableSkeleton rows={rows} />;
  }

  if (type === 'list') {
    return <ListSkeleton count={count} />;
  }

  // Fallback to spinner for backward compatibility
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`} />
  );
}