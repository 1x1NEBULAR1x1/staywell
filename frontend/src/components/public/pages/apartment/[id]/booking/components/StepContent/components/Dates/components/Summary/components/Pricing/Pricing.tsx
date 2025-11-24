import classes from './Pricing.module.scss';

type PricingProps = {
  base_price: number;
  deposit: number;
  total_price: number;
}

export const Pricing = ({ base_price, deposit, total_price }: PricingProps) => (
  <div className={classes.pricing}>
    <div className={classes.row}>
      <span>Base price</span>
      <span>${base_price.toFixed(2)}</span>
    </div>
    <div className={classes.row}>
      <span>Deposit</span>
      <span>${deposit.toFixed(2)}</span>
    </div>
    <div className={classes.row_total}>
      <span>Total</span>
      <span>${total_price.toFixed(2)}</span>
    </div>
  </div>
);