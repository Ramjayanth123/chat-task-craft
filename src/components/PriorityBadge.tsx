
import React from 'react';
import { Priority } from '../types/Task';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityStyles = (priority: Priority) => {
    switch (priority) {
      case 'P1':
        return 'priority-p1';
      case 'P2':
        return 'priority-p2';
      case 'P3':
        return 'priority-p3';
      case 'P4':
        return 'priority-p4';
      default:
        return 'priority-p3';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyles(priority)}`}>
      {priority}
    </span>
  );
};
