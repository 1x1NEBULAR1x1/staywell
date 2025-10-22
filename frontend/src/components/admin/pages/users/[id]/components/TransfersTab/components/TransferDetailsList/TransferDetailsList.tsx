import classes from './TransferDetailsList.module.scss';
import { TransferDetail } from '@shared/src';

export const TransferDetailsList = ({ transferDetails }: { transferDetails: TransferDetail[] }) => {
  if (transferDetails.length === 0) {
    return <p className={classes.empty}>No transfer details found</p>;
  }

  return (
    <div className={classes.transfer_details_list}>
      {transferDetails.map((transferDetail) => (
        <div key={transferDetail.id} className={classes.transfer_detail_item}>
          <div className={classes.transfer_info}>
            <div className={classes.bank_name}>
              {transferDetail.bank_name}
            </div>
            <div className={classes.account_number}>
              {transferDetail.account_number}
            </div>
          </div>

          <div className={classes.transfer_details}>
            <div className={classes.detail}>
              <span className={classes.label}>Payer:</span>
              <span>{transferDetail.payer_name}</span>
            </div>
            <div className={classes.detail}>
              <span className={classes.label}>SWIFT:</span>
              <span>{transferDetail.swift}</span>
            </div>
          </div>

          <div className={classes.transfer_date}>
            Added: {new Date(transferDetail.created).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

