'use client';

import { ExtendedApartment } from '@shared/src';
import classes from './GalleryTab.module.scss';
import { Gallery } from './components';

export const GalleryTab = ({ apartment }: { apartment: ExtendedApartment }) => {
  const excludedCount = apartment.images.filter(img => img.is_excluded).length;
  const activeCount = apartment.images.filter(img => !img.is_excluded).length + (apartment.image ? 1 : 0);

  return (
    <div className={classes.gallery_tab}>
      <div className={classes.header}>
        <div className={classes.header_content}>
          <h3 className={classes.title}>Image Gallery</h3>
          <p className={classes.subtitle}>
            Manage apartment images. Set main image, add new photos, or delete existing ones.
          </p>
        </div>
        <div className={classes.stats}>
          <div className={classes.stat_item}>
            <span className={classes.stat_value}>{apartment.images.length + (apartment.image ? 1 : 0)}</span>
            <span className={classes.stat_label}>Total Images</span>
          </div>
          <div className={classes.stat_item}>
            <span className={classes.stat_value}>{activeCount}</span>
            <span className={classes.stat_label}>Active</span>
          </div>
          <div className={`${classes.stat_item} ${excludedCount > 0 ? classes.stat_warning : ''}`}>
            <span className={classes.stat_value}>{excludedCount}</span>
            <span className={classes.stat_label}>Excluded</span>
          </div>
        </div>
      </div>

      <div className={classes.gallery_section}>
        <Gallery apartment={apartment} />
      </div>

      <div className={classes.info_section}>
        <h4 className={classes.info_title}>Tips for better photos</h4>
        <ul className={classes.tips_list}>
          <li>Use high-quality images (minimum 1200x800px)</li>
          <li>Include photos of all rooms and amenities</li>
          <li>Choose a well-lit, attractive photo as the main image</li>
          <li>Show the apartment from different angles</li>
          <li>Keep the images up-to-date</li>
        </ul>
      </div>
    </div>
  );
};

