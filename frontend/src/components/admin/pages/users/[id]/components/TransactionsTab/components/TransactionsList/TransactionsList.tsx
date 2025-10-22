import classes from './TransactionsList.module.scss';
import { Transaction } from '@shared/src';

export const TransactionsList = ({ transactions }: { transactions: Transaction[] }) => {
  if (transactions.length === 0) {
    return <p className={classes.empty}>No transactions found</p>;
  }

  return (
    <div className={classes.transactions_list}>
      {transactions.map((transaction) => (
        <div key={transaction.id} className={classes.transaction_item}>
          <div className={classes.transaction_header}>
            <span className={classes.amount}>${transaction.amount}</span>
            <span className={`${classes.status} ${classes[transaction.transaction_status.toLowerCase()]}`}>
              {transaction.transaction_status}
            </span>
          </div>

          <div className={classes.transaction_details}>
            <div className={classes.detail}>
              <span className={classes.label}>Type:</span>
              <span>{transaction.transaction_type}</span>
            </div>
            <div className={classes.detail}>
              <span className={classes.label}>Method:</span>
              <span>{transaction.payment_method}</span>
            </div>
            <div className={classes.detail}>
              <span className={classes.label}>Date:</span>
              <span>{new Date(transaction.created).toLocaleString()}</span>
            </div>
          </div>

          <div className={classes.description}>
            <span className={classes.label}>Description:</span>
            <p>{transaction.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

