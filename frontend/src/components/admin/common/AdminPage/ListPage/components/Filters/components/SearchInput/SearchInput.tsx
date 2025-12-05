import { SearchIcon } from "lucide-react";
import classes from "./SearchInput.module.scss";

type SearchInputProps = {
  search?: string;
  setSearch: (search: string) => void;
};

export const SearchInput = ({ search, setSearch }: SearchInputProps) => (
  <div className={classes.container}>
    <SearchIcon className={classes.icon} size={12} />
    <input
      className={classes.input}
      placeholder="Search"
      value={search ?? ""}
      onChange={(e) => setSearch(e.currentTarget.value)}
    />
  </div>
);
