import { AdminPage } from '../../common/AdminPage';
import Link from 'next/link';
import classes from './Management.module.scss';

export const Management = () => (
  <AdminPage title="Management">
    <div className={classes.management_container}>
      <Link href="/admin/management/amenities" className={classes.management_link}>
        <div className={classes.management_card}>
          <h3>Amenities</h3>
          <p>Manage apartment amenities</p>
        </div>
      </Link>
      <Link href="/admin/management/bed-types" className={classes.management_link}>
        <div className={classes.management_card}>
          <h3>Bed Types</h3>
          <p>Manage bed types for apartments</p>
        </div>
      </Link>
      <Link href="/admin/management/additional-options" className={classes.management_link}>
        <div className={classes.management_card}>
          <h3>Additional Options</h3>
          <p>Manage booking additional options</p>
        </div>
      </Link>
    </div>
  </AdminPage>
);