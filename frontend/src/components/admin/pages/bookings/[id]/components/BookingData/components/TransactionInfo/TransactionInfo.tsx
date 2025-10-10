import classes from './TransactionInfo.module.scss';
import { Transaction, TransactionStatus, PaymentMethod } from '@shared/src';
import { CreditCard, Banknote, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

const getStatusText = (status: TransactionStatus) => {
  const statusMap = {
    PENDING: 'Pending',
    SUCCESS: 'Success',
    CANCELED: 'Cancelled',
    FAILED: 'Failed'
  };
  return statusMap[status] || status;
};

const getStatusIcon = (status: TransactionStatus) => {
  const iconMap = {
    PENDING: Clock,
    SUCCESS: CheckCircle,
    CANCELED: XCircle,
    FAILED: AlertCircle
  };
  return iconMap[status] || AlertCircle;
};

const getStatusClass = (status: TransactionStatus) => {
  const classMap = {
    PENDING: classes.status_pending,
    SUCCESS: classes.status_success,
    CANCELED: classes.status_canceled,
    FAILED: classes.status_failed
  };
  return classMap[status] || '';
};

const getPaymentMethodText = (method: PaymentMethod) => {
  const methodMap = {
    CASH: 'Cash',
    CARD: 'Card',
    TRANSFER: 'Transfer'
  };
  return methodMap[method] || method;
};

const getPaymentMethodIcon = (method: PaymentMethod) => {
  const iconMap = {
    CASH: Banknote,
    CARD: CreditCard,
    TRANSFER: RefreshCw
  };
  return iconMap[method] || CreditCard;
};

export const TransactionInfo = ({ transaction }: { transaction: Transaction | null | undefined }) => {
  if (!transaction) {
    return (
      <div className={classes.transaction_info}>
        <div className={classes.header}>
          <AlertCircle className={classes.header_icon} />
          <h3 className={classes.title}>Transaction Information</h3>
        </div>
        <div className={classes.content}>
          <div className={classes.no_transaction}>
            Transaction not found
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(transaction.transaction_status);
  const PaymentIcon = getPaymentMethodIcon(transaction.payment_method);

  return (
    <div className={classes.transaction_info}>
      <div className={classes.header}>
        <PaymentIcon className={classes.header_icon} />
        <h3 className={classes.title}>Transaction Information</h3>
        <div className={`${classes.status} ${getStatusClass(transaction.transaction_status)}`}>
          <StatusIcon className={classes.status_icon} />
          {getStatusText(transaction.transaction_status)}
        </div>
      </div>

      <div className={classes.content}>
        <div className={classes.transaction_details}>
          <div className={classes.detail_row}>
            <span className={classes.detail_label}>Transaction ID:</span>
            <span className={classes.detail_value}>#{transaction.id.slice(-8).toUpperCase()}</span>
          </div>

          <div className={classes.detail_row}>
            <span className={classes.detail_label}>Amount:</span>
            <span className={classes.amount}>${transaction.amount}</span>
          </div>

          <div className={classes.detail_row}>
            <span className={classes.detail_label}>Payment Method:</span>
            <span className={classes.detail_value}>
              {getPaymentMethodText(transaction.payment_method)}
            </span>
          </div>

          <div className={classes.detail_row}>
            <span className={classes.detail_label}>Transaction Type:</span>
            <span className={classes.detail_value}>{transaction.transaction_type}</span>
          </div>

          {transaction.description && (
            <div className={classes.detail_row}>
              <span className={classes.detail_label}>Description:</span>
              <span className={classes.detail_value}>{transaction.description}</span>
            </div>
          )}

          <div className={classes.detail_row}>
            <span className={classes.detail_label}>Created:</span>
            <span className={classes.detail_value}>
              {new Date(transaction.created).toLocaleString('en-US')}
            </span>
          </div>

          {transaction.updated !== transaction.created && (
            <div className={classes.detail_row}>
              <span className={classes.detail_label}>Updated:</span>
              <span className={classes.detail_value}>
                {new Date(transaction.updated).toLocaleString('en-US')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
