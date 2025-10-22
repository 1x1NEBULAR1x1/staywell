import classes from './InfoSection.module.scss';
import { UserWithoutPassword } from '@shared/src';
import { Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';

export const InfoSection = ({ user }: { user: UserWithoutPassword }) => (
  <div className={classes.info_grid}>
    <div className={classes.info_card}>
      <div className={classes.info_header}>
        <Mail className={classes.info_icon} />
        <span className={classes.info_label}>Email</span>
      </div>
      <div className={classes.info_value}>{user.email}</div>
      <div className={classes.verification_badge}>
        {user.email_verified ? (
          <>
            <CheckCircle size={14} className={classes.verified} />
            <span>Verified</span>
          </>
        ) : (
          <>
            <XCircle size={14} className={classes.not_verified} />
            <span>Not Verified</span>
          </>
        )}
      </div>
    </div>

    <div className={classes.info_card}>
      <div className={classes.info_header}>
        <Phone className={classes.info_icon} />
        <span className={classes.info_label}>Phone Number</span>
      </div>
      <div className={classes.info_value}>
        {user.phone_number || 'Not provided'}
      </div>
      {user.phone_number && (
        <div className={classes.verification_badge}>
          {user.phone_verified ? (
            <>
              <CheckCircle size={14} className={classes.verified} />
              <span>Verified</span>
            </>
          ) : (
            <>
              <XCircle size={14} className={classes.not_verified} />
              <span>Not Verified</span>
            </>
          )}
        </div>
      )}
    </div>

    <div className={classes.info_card}>
      <div className={classes.info_header}>
        <Calendar className={classes.info_icon} />
        <span className={classes.info_label}>Date of Birth</span>
      </div>
      <div className={classes.info_value}>
        {user.date_of_birth
          ? new Date(user.date_of_birth).toLocaleDateString()
          : 'Not provided'}
      </div>
    </div>
  </div>
);