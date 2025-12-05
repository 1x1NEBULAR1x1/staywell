import classes from "./AdditionalOptions.module.scss";
import { AdditionalOptionList, SelectedAdditionalOptions } from "./components";

export const AdditionalOptions = () => (
  <div className={classes.container}>
    <AdditionalOptionList />

    <SelectedAdditionalOptions />
  </div>
);
