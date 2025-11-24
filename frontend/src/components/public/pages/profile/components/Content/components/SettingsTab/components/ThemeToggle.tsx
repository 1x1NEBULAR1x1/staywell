"use client";

import { useTheme } from "@/hooks/common";
import { Sun, Moon } from "lucide-react";
import classes from "./ThemeToggle.module.scss";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={classes.theme_toggle}>
      <div className={classes.section_header}>
        <h3>Тема приложения</h3>
        <p>Выберите предпочтительную тему интерфейса</p>
      </div>

      <div className={classes.toggle_container}>
        <button
          className={`${classes.theme_button} ${theme === 'light' ? classes.active : ''}`}
          onClick={() => theme !== 'light' && toggleTheme()}
          type="button"
        >
          <Sun size={20} />
          <span>Светлая</span>
        </button>

        <button
          className={`${classes.theme_button} ${theme === 'dark' ? classes.active : ''}`}
          onClick={() => theme !== 'dark' && toggleTheme()}
          type="button"
        >
          <Moon size={20} />
          <span>Тёмная</span>
        </button>
      </div>
    </div>
  );
};
