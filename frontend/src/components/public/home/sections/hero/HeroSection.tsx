import Image from 'next/image';
import classes from './HeroSection.module.scss';
import heroBanner from '@/../public/pages/home/hero-image.jpg';
import { Metrics } from './components/Metrics';


export const HeroSection = () => (
  <section className={classes.section}>
    <div className={classes.about}>
      <h1 className={classes.title}>Feel the Breeze, <br />Live with Ease</h1>
      <p className={classes.description}>Create lasting memories with your family — <br />comfort, fun, and sunshine included. <br />We’ll be happy to welcome you and make your stay truly special.</p>
      <button className={classes.button}>Show More</button>

      <Metrics />
    </div>
    <div className={classes.banner}>
      <div className={classes.image}>
        <Image src={heroBanner.src} alt="Hero Banner" width={500} height={500} />
      </div>
      <div className={classes.frame}></div>
    </div>
  </section>
);