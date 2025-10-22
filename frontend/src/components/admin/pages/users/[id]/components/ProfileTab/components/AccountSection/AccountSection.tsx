import { BaseListResult, SessionData, UserWithoutPassword } from '@shared/src';
import classes from './AccountSection.module.scss';


export const AccountSection = ({ user, sessions }: { user: UserWithoutPassword, sessions?: BaseListResult<SessionData> }) => (
  <div className={classes.account_section}>
    <h3 className={classes.section_title}>Account Information</h3>
    <div className={classes.account_details}>
      <div className={classes.detail}>
        <span className={classes.detail_label}>Created At:</span>
        <span className={classes.detail_value}>
          {new Date(user.created).toLocaleString()}
        </span>
      </div>
      <div className={classes.detail}>
        <span className={classes.detail_label}>Updated At:</span>
        <span className={classes.detail_value}>
          {new Date(user.updated).toLocaleString()}
        </span>
      </div>
      <div className={classes.detail}>
        <span className={classes.detail_label}>Last Login:</span>
        <span className={classes.detail_value}>
          {sessions?.items.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())[0].created
            ? new Date(sessions?.items.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())[0].created).toLocaleString()
            : 'Never'}
        </span>
      </div>
    </div>
  </div>
);