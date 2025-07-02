import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'candidate' | 'job' | 'compliance' | 'urgency';
}

export default function StatusBadge({ status, type = 'candidate' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (type) {
      case 'candidate':
        switch (status) {
          case 'active':
            return 'bg-green-100 text-green-800';
          case 'inactive':
            return 'bg-gray-100 text-gray-800';
          case 'placed':
            return 'bg-blue-100 text-blue-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      case 'job':
        switch (status) {
          case 'open':
            return 'bg-green-100 text-green-800';
          case 'filled':
            return 'bg-blue-100 text-blue-800';
          case 'closed':
            return 'bg-gray-100 text-gray-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      case 'compliance':
        return status === 'true' || status === true
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800';
      case 'urgency':
        switch (status) {
          case 'high':
            return 'bg-red-100 text-red-800';
          case 'medium':
            return 'bg-yellow-100 text-yellow-800';
          case 'low':
            return 'bg-green-100 text-green-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = () => {
    if (type === 'compliance') {
      return status === 'true' || status === true ? 'Yes' : 'No';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {formatStatus()}
    </span>
  );
}