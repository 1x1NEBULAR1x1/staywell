'use client';

import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import classes from './ChatSidebarHeader.module.scss';
import clsx from 'clsx';

interface ChatSidebarHeaderProps {
  search_query: string;
  is_collapsed: boolean;
  onSearchChange: (query: string) => void;
  onToggleCollapse: () => void;
}

export const ChatSidebarHeader = ({
  search_query,
  is_collapsed,
  onSearchChange,
  onToggleCollapse,
}: ChatSidebarHeaderProps) => {
  return (
    <div className={classes.header}>
      <button
        className={classes.collapse_button}
        onClick={onToggleCollapse}
        title={is_collapsed ? 'Expand chat' : 'Collapse chat'}
      >
        {is_collapsed ? <ChevronLeft /> : <ChevronRight />}
      </button>
      <div
        className={clsx(classes.search_container, {
          [classes.search_container_collapsed]: is_collapsed,
        })}
      >
        <Search />
        <input
          type="text"
          placeholder="Search"
          value={search_query}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

