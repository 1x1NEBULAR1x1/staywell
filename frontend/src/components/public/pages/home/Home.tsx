import classes from './Home.module.scss';

import { Hero, Filters, Recomendations, Features } from './components';

export const Home = () => {
  return (
    <div className={classes.page}>
      <Hero />

      <Filters />

      <Recomendations />

      <Features />
    </div>
  )
}