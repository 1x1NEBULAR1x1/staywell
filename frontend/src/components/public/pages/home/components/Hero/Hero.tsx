import classes from './Hero.module.scss';

import ic_traveler from '@/../public/pages/home/ic-traveler.png';
import ic_treasure from '@/../public/pages/home/ic-treasure.png';
import ic_cities from '@/../public/pages/home/ic-cities.png';

import hero_banner from '@/../public/pages/home/hero-image.jpg';

type HeroProps = {}

export const Hero = ({ }: HeroProps) => (
  <section className={classes.section_hero}>

    <div className={classes.about}>

      <h1 className={classes.title}>Feel the Breeze, <br />Live with Ease</h1>

      <p className={classes.description}>Create lasting memories with your family — <br />comfort, fun, and sunshine included. <br />We’ll be happy to welcome you and make your stay truly special.</p>

      <button className={classes.button}>Show More</button>

      <div className={classes.metrics}>

        <div className={classes.item}>

          <img src={ic_traveler.src} alt="Traveler" width={24} height={24} />

          <span className={classes.title}>2500<span>Users</span></span>

        </div>

        <div className={classes.item}>

          <img src={ic_treasure.src} alt="Treasure" width={24} height={24} />

          <span className={classes.title}>200 <span>Treasures</span></span>

        </div>

        <div className={classes.item}>

          <img src={ic_cities.src} alt="Cities" width={24} height={24} />

          <span className={classes.title}>788 <span>Points</span></span>

        </div>

      </div>

    </div>

    <div className={classes.banner}>

      <div className={classes.image}>
        <img src={hero_banner.src} alt="Hero Banner" width={520} height={410} />
      </div>

      <div className={classes.frame}></div>

    </div>

  </section>
);