import classes from "./Header.module.scss";

export const Header = () => {
  return (
    <section className={classes.header}>
      <h1 className={classes.title}>Apartments</h1>
      <p className={classes.subtitle}>Find your perfect stay</p>
    </section>
  );
};
