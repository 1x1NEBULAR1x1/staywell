import { Logo } from "@/components/common/Logo";
import { Navigation } from "./components";
import classes from "./Sidebar.module.scss";

export const Sidebar = () => (
  <aside className={classes.sidebar}>
    <header className={classes.header}>
      <Logo />
    </header>
    <Navigation />
  </aside>
);
