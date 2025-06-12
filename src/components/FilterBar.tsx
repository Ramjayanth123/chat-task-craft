
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Priority } from '../types/Task';

interface FilterBarProps {
  filter: {
    priority?: Priority;
    assignee?: string;
    sortBy: 'dueDate' | 'priority' | 'assignee';
  };
  onFilterChange: (filter: FilterBarProps['filter']) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  assignees: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  assignees
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg input-focus"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filter.priority || ''}
            onChange={(e) => onFilterChange({
              ...filter,
              priority: e.target.value as Priority || undefined
            })}
            className="px-3 py-2 bg-background border border-border rounded-lg input-focus"
          >
            <option value="">All Priorities</option>
            <option value="P1">P1 - Critical</option>
            <option value="P2">P2 - High</option>
            <option value="P3">P3 - Medium</option>
            <option value="P4">P4 - Low</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <select
          value={filter.assignee || ''}
          onChange={(e) => onFilterChange({
            ...filter,
            assignee: e.target.value || undefined
          })}
          className="px-3 py-2 bg-background border border-border rounded-lg input-focus"
        >
          <option value="">All Assignees</option>
          {assignees.map(assignee => (
            <option key={assignee} value={assignee}>{assignee}</option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={filter.sortBy}
          onChange={(e) => onFilterChange({
            ...filter,
            sortBy: e.target.value as 'dueDate' | 'priority' | 'assignee'
          })}
          className="px-3 py-2 bg-background border border-border rounded-lg input-focus"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="assignee">Sort by Assignee</option>
        </select>
      </div>
    </div>
  );
};
