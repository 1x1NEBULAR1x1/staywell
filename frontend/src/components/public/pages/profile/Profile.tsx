import classes from "./Profile.module.scss";
import { Sidebar } from "./components/Sidebar";
import { Content } from "./components/Content";


export const Profile = () => {
  return (
    <div className={classes.page}>
      <Sidebar />
      <Content />
    </div>
  );
};
