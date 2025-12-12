import type { UserWithoutPassword } from "@shared/src";
import { Edit } from "lucide-react";
import { ChatButton } from "../../../ChatButton/ChatButton";
import classes from "./Header.module.scss";

export const Header = ({
  user,
  setIsEditModalOpen,
}: {
  user: UserWithoutPassword;
  setIsEditModalOpen: (isEditModalOpen: boolean) => void;
}) => (
  <div className={classes.header}>
    <h2 className={classes.title}>Profile Information</h2>
    <div className={classes.actions}>
      <ChatButton user_id={user.id} />
      <button
        type="button"
        className={classes.edit_button}
        onClick={() => setIsEditModalOpen(true)}
      >
        <Edit size={16} />
        Edit Profile
      </button>
    </div>
  </div>
);
