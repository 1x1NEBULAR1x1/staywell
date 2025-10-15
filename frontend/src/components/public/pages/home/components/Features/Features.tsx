import classes from './Features.module.scss';

import relax_pool from '@/../public/pages/home/features/feature-relax-pool.jpg';
import tranquility_zone from '@/../public/pages/home/features/feature-tranquility-zone.jpg';
import green_villa from '@/../public/pages/home/features/feature-green-villa.jpg';
import private_dinner_experience from '@/../public/pages/home/features/feature-private-dinner-experience.jpg';
import main_pool from '@/../public/pages/home/features/feature-main-pool.jpg';
import modern_fitness_room from '@/../public/pages/home/features/feature-modern-fitness-room.jpg';
import conference_room from '@/../public/pages/home/features/feature-conference-room.jpg';
import view_from_the_window from '@/../public/pages/home/features/feature-view-from-the-window.jpg';

type FeaturesProps = {}

export const Features = ({ }: FeaturesProps) => (
  <section className={classes.section_features}>

    <div className={classes.features_group_columns}>

      <div className={classes.feature_group}>
        <div className={classes.image}>
          <img src={relax_pool.src} alt="Relax Pool" />
        </div>
        <p className={classes.title} > Relax Pool </p>
      </div>

      <div className={classes.feature_group}>
        <div className={classes.image}>
          <img src={tranquility_zone.src} alt="Tranquility Zone" />
        </div>
        <p className={classes.title} > Tranquility Zone </p>
      </div>

      <div className={classes.feature_group}>
        <div className={classes.image}>
          <img src={green_villa.src} alt="Green Villa" />
        </div>
        <p className={classes.title} > Green Villa </p>
      </div>

      <div className={classes.feature_group}>
        <div className={classes.image}>
          <img src={private_dinner_experience.src} alt="Private Dinner Experience" />
        </div>
        <p className={classes.title} > Private Dinner Experience </p>
      </div>

    </div>

    <div className={classes.features_group_columns}>

      <div className={classes.feature_group}>
        <div className={classes.image}>
          <img src={main_pool.src} alt="Main Pool" />
        </div>
        <p className={classes.title} > Main Pool </p>
      </div>

      <div className={classes.feature_group}>
        <div className={classes.image}>
          <img src={modern_fitness_room.src} alt="Modern Fitness Room" />
        </div>
        <p className={classes.title} > Modern Fitness Room </p>
      </div>

      <div className={classes.feature_group}>
        <div className={classes.image}>
          <img src={conference_room.src} alt="Conference Room" />
        </div>
        <p className={classes.title} > Conference Room </p>
      </div>

      <div className={classes.feature_group}>
        <div className={classes.image}>
          <img src={view_from_the_window.src} alt="View from the Window" />
        </div>
        <p className={classes.title} > View from the Window </p>
      </div>

    </div>

  </section>

);