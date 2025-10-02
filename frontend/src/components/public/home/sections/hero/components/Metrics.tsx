import classes from '../HeroSection.module.scss'
import Image from 'next/image';
import ic_traveler from '@/../public/pages/home/ic-traveler.png';
import ic_treasure from '@/../public/pages/home/ic-treasure.png';
import ic_cities from '@/../public/pages/home/ic-cities.png';

export const Metrics = () => (
  <div className={classes.metrics}>
    <div className={classes.item}>
      <Image priority={true} quality={100} src={ic_traveler.src} alt="Traveler" width={24} height={24} />
      <span className={classes.title}>2500<span>Users</span></span>
    </div>
    <div className={classes.item}>
      <Image priority={true} quality={100} src={ic_treasure.src} alt="Treasure" width={24} height={24} />
      <span className={classes.title}>200 <span>Treasures</span></span>
    </div>
    <div className={classes.item}>
      <Image priority={true} quality={100} src={ic_cities.src} alt="Cities" width={24} height={24} />
      <span className={classes.title}>788 <span>Points</span></span>
    </div>
  </div>
);