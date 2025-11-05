import classes from './BedTypeCard.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

import Image from 'next/image';
import { BedType } from '@shared/src';
import { Shimmer } from '@/components/styles';

type BedTypeCardProps = {
  bed_type: BedType;
  setEditBedTypeData: (bed_type: BedType) => void;
}

export const BedTypeCard = ({ bed_type, setEditBedTypeData }: BedTypeCardProps) => (
  <tr className={classes.bed_type_row} onClick={() => setEditBedTypeData(bed_type)} >
    <td>
      <div className={classes.bed_type_row_name_container}>
        <Image
          src={bed_type.image || no_image.src}
          alt="No Image"
          width={500}
          height={500}
          className={classes.bed_type_row_avatar}
        />
        <div className={classes.bed_type_row_name_container_info}>
          <p className={classes.bed_type_row_name_container_info_name}>
            {bed_type.name}
          </p>
        </div>
      </div>
    </td>
    <td className={classes.bed_type_row_created}>{new Date(bed_type.created).toDateString()}</td>
  </tr>
);

export const BedTypeCardShimmer = () => (
  <tr className={classes.bed_type_row}>
    <td>
      <div className={classes.bed_type_row_name_container}>
        <Shimmer style={{ width: '6rem', height: '6rem', borderRadius: '4px' }} />
        <div className={classes.bed_type_row_name_container_info}>
          <Shimmer style={{ width: '150px', height: '18px', borderRadius: '4px' }} />
        </div>
      </div>
    </td>
    <td><Shimmer style={{ width: '120px', height: '14px', borderRadius: '4px' }} /></td>
  </tr >
)
