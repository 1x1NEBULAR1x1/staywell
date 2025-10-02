import classes from './FiltersSection.module.scss';


export const FiltersSection = () => (
  <section className={classes.section}>
    <div className={classes.container}>
      <div className={classes.filter}>
        Filter 1
      </div>
      <div className={classes.filter}>
        Filter 2
      </div>
      <div className={classes.filter}>
        Filter 3
      </div>
      <button className={classes.button}>Search</button>
    </div>
  </section>
);