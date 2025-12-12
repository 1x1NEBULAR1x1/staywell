import classes from "./Header.module.scss";

export const Header = () => {
  return (
    <section className={classes.header}>
      <h1 className={classes.title}>Events</h1>
      <p className={classes.subtitle}>Find your events during your stay</p>
    </section>
  );
};
