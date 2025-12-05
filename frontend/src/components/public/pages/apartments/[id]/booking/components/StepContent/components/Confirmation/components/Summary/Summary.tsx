import classes from "./Summary.module.scss";

export const Summary = ({ total_price }: { total_price: number }) => (
  <div className={classes.total_summary}>
    <div className={classes.total_row}>
      <span className={classes.total_label}>Total to pay:</span>
      <span className={classes.total_amount}>{total_price.toFixed(2)} $</span>
    </div>
  </div>
);
