import { Content } from "./components/Content";
import { Sidebar } from "./components/Sidebar";
import classes from "./Profile.module.scss";

export const Profile = () => {
  return (
    <div className={classes.page}>
      <Sidebar />
      <Content />
    </div>
  );
};
