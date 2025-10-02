import classes from './ReviewCard.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

import Image from 'next/image';
import { ExtendedReview } from '@shared/src';
import { Shimmer } from '@/components/styles';

type ReviewCardProps = {
  review: ExtendedReview;
}

export const ReviewCard = ({ review }: ReviewCardProps) => (
  <tr className={classes.review_row}>
    <td>
      <div className={classes.review_row_name_container}>
        <Image
          src={review.apartment.image || no_image.src}
          alt="No Image"
          width={500}
          height={500}
          className={classes.review_row_avatar}
        />
        <div className={classes.review_row_name_container_info}>
          <p className={classes.review_row_name_container_info_name}>
            {review.apartment.name}
            <span className={classes.review_row_name_container_info_location}>
              {review.apartment.floor} - {review.apartment.number}
            </span>
          </p>
          <p className={classes.apartment_row_name_container_info_description}>
            {review.apartment.description || 'No description'}
          </p>
        </div>
      </div>
    </td>
    <td ><span
      className={`${classes.review_row_status} ${review.apartment.is_available ? classes.review_row_status_available : classes.review_row_status_unavailable}`}>
      {review.apartment.is_available ? 'Available' : 'Unavailable'}
    </span></td>
    <td ><span className={classes.review_row_type}>{review.apartment.type.toLowerCase()}</span></td>
    <td className={classes.review_row_created}>{new Date(review.apartment.created).toDateString()}</td>
  </tr>
);


export const ReviewCardShimmer = () => (
  <tr className={classes.review_row}>
    <td>
      <div className={classes.review_row_name_container}>
        <Shimmer className={classes.review_row_avatar} />
        <div className={classes.review_row_name_container_info}>
          <Shimmer className={classes.review_row_name_container_info_name} />
          <Shimmer className={classes.review_row_name_container_info_description} />
        </div>
      </div>
    </td>
    <td ><Shimmer className={classes.review_row_role} /></td>
    <td ><Shimmer className={classes.review_row_status} /></td>
    <td ><Shimmer className={classes.review_row_created} /></td>
  </tr >
);