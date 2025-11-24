import classes from './Apartment.module.scss';
import { ExtendedApartment } from "@shared/src";
import { Header, Images, ApartmentInfo } from './components';

export const Apartment = ({ initial_data }: { initial_data: ExtendedApartment }) => {
  return (
    <div className={classes.page}>
      <Header title={initial_data.name || 'Superior Room'} />
      <Images apartment={initial_data} />
      <ApartmentInfo apartment={initial_data} />
    </div>
  )
}