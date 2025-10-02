import { HeroSection, FiltersSection } from './sections';
import classes from './Home.module.scss';

type HomeProps = {}

export const Home = ({ }: HomeProps) => (
  <div className={classes.page}>
    <HeroSection />
    <FiltersSection />
  </div>
);