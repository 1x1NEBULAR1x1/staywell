import classes from './ReviewsList.module.scss';
import { ExtendedReview } from '@shared/src';

export const ReviewsList = ({ reviews }: { reviews: ExtendedReview[] }) => {
  if (reviews.length === 0) {
    return <p className={classes.empty}>No reviews found</p>;
  }

  return (
    <div className={classes.reviews_list}>
      {reviews.map((review) => (
        <div key={review.id} className={classes.review_item}>
          <div className={classes.review_header}>
            <div className={classes.rating}>
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              <span className={classes.rating_number}>{review.rating}/5</span>
            </div>
            {review.apartment && (
              <span className={classes.apartment_name}>
                {review.apartment.name || `Apartment ${review.apartment.number}`}
              </span>
            )}
          </div>

          {review.comment && (
            <div className={classes.comment}>
              <p>{review.comment}</p>
            </div>
          )}

          <div className={classes.review_date}>
            {new Date(review.created).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

