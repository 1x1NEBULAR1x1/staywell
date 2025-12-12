import { UserRoundX } from "lucide-react";
import classes from "./EmptyMessage.module.scss";

export const EmptyMessage = () => (
  <div className={classes.list_empty}>
    <UserRoundX size={48} />
    <div>No users found</div>
  </div>
);
