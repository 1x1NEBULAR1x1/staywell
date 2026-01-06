import { Calendar, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/common/useAuth";
import classes from "./Dropdown.module.scss";

type DropdownProps = {
  setIsDropdownOpen: (isOpen: boolean) => void;
};

export const Dropdown = ({ setIsDropdownOpen }: DropdownProps) => {
  const router = useRouter();
  const { logout, is_logout_loading } = useAuth();

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <div className={classes.dropdown}>
      <button
        type="button"
        className={classes.dropdown_item}
        onClick={() => {
          setIsDropdownOpen(false);
          router.push("/bookings");
        }}
      >
        <Calendar size={16} />
        <span>Bookings</span>
      </button>

      <button
        type="button"
        className={classes.dropdown_item}
        onClick={() => {
          setIsDropdownOpen(false);
          router.push("/profile");
        }}
      >
        <User size={16} />
        <span>Profile</span>
      </button>

      <div className={classes.dropdown_divider}></div>

      <button
        type="button"
        className={classes.dropdown_item}
        onClick={handleLogout}
        disabled={is_logout_loading}
      >
        <LogOut size={16} />
        <span>{is_logout_loading ? "Signing out..." : "Logout"}</span>
      </button>
    </div>
  );
};
