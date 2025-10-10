import classes from './AdditionalOptionCard.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

import Image from 'next/image';
import { AdditionalOption } from '@shared/src';
import { Shimmer } from '@/components/styles';

type AdditionalOptionCardProps = {
  additional_option: AdditionalOption;
  setEditAdditionalOptionData: (additional_option: AdditionalOption) => void;
}

export const AdditionalOptionCard = ({ additional_option, setEditAdditionalOptionData }: AdditionalOptionCardProps) => (
  <tr className={classes.additional_option_row} onClick={() => setEditAdditionalOptionData(additional_option)} >
    <td>
      <div className={classes.additional_option_row_name_container}>
        <Image
          src={additional_option.image || no_image.src}
          alt="No Image"
          width={500}
          height={500}
          className={classes.additional_option_row_avatar}
        />
        <div className={classes.additional_option_row_name_container_info}>
          <p className={classes.additional_option_row_name_container_info_name}>
            {additional_option.name}
          </p>
          <p className={classes.additional_option_row_name_container_info_description}>
            {additional_option.description}
          </p>
        </div>
      </div>
    </td>
    <td className={classes.additional_option_row_price}>${additional_option.price}</td>
    <td className={classes.additional_option_row_created}>{new Date(additional_option.created).toDateString()}</td>
  </tr>
);

export const AdditionalOptionCardShimmer = () => (
  <tr className={classes.additional_option_row}>
    <td>
      <div className={classes.additional_option_row_name_container}>
        <Shimmer className={classes.additional_option_row_avatar} />
        <div className={classes.additional_option_row_name_container_info}>
          <Shimmer className={classes.additional_option_row_name_container_info_name} />
          <Shimmer className={classes.additional_option_row_name_container_info_description} />
        </div>
      </div>
    </td>
    <td ><Shimmer className={classes.additional_option_row_price} /></td>
    <td ><Shimmer className={classes.additional_option_row_created} /></td>
  </tr >
)
