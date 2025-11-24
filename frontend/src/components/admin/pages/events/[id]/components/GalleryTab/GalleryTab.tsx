'use client';

import { ExtendedEvent } from '@shared/src';
import classes from './GalleryTab.module.scss';
import { Gallery } from './components';

export const GalleryTab = ({ event }: { event: ExtendedEvent }) => {
  const excludedCount = event.images.filter(img => img.is_excluded).length;
  const activeCount = event.images.filter(img => !img.is_excluded).length + (event.image ? 1 : 0);

  return (
    <div className={classes.gallery_tab}>
      <div className={classes.header}>
        <div className={classes.header_content}>
          <h3 className={classes.title}>Image Gallery</h3>
          <p className={classes.subtitle}>
            Manage event images. Set main image, add new photos, or delete existing ones.
          </p>
        </div>
        <div className={classes.stats}>
          <div className={classes.stat_item}>
            <span className={classes.stat_value}>{event.images.length + (event.image ? 1 : 0)}</span>
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
        <Gallery event={event} />
      </div>

      <div className={classes.info_section}>
        <h4 className={classes.info_title}>Tips for better photos</h4>
        <ul className={classes.tips_list}>
          <li>Use high-quality images (minimum 1200x800px)</li>
          <li>Include photos showing the event atmosphere and activities</li>
          <li>Choose a well-lit, attractive photo as the main image</li>
          <li>Show the event location and participants</li>
          <li>Keep the images up-to-date and relevant</li>
        </ul>
      </div>
    </div>
  );
};

