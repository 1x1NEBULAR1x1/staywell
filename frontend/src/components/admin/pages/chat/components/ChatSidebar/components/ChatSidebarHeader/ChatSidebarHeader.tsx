"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import classes from "./ChatSidebarHeader.module.scss";
import { useChat } from "@/hooks/admin/chat/useChat";

export const ChatSidebarHeader = () => {
  const { toggleCollapse, is_collapsed, search_query, setSearchQuery } = useChat()
  return (
    <div className={classes.header}>
      <button
        className={classes.collapse_button}
        onClick={toggleCollapse}
        title={is_collapsed ? "Expand chat" : "Collapse chat"}
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
          onChange={(e) => setSearchQuery(e.target.value ?? '')}
        />
      </div>
    </div>
  );
};
