'use client';

import { ExtendedApartment } from '@shared/src';
import classes from './ReviewsTab.module.scss';
import { Star } from 'lucide-react';

export const ReviewsTab = ({ apartment }: { apartment: ExtendedApartment }) => {
  const reviews = apartment.reviews || [];
  const averageRating = apartment.rating || 0;
  const reviewsCount = reviews.length;

  // Calculate rating distribution
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className={classes.reviews_tab}>
      <div className={classes.summary_section}>
        <div className={classes.overall_rating}>
          <div className={classes.rating_number}>{averageRating.toFixed(1)}</div>
          <div className={classes.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`${classes.star} ${star <= Math.round(averageRating) ? classes.filled : ''}`}
                fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <div className={classes.reviews_count}>
            Based on {reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        <div className={classes.rating_bars}>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage = reviewsCount > 0 ? (count / reviewsCount) * 100 : 0;
            return (
              <div key={rating} className={classes.rating_bar}>
                <span className={classes.rating_label}>{rating} stars</span>
                <div className={classes.bar_container}>
                  <div
                    className={classes.bar_fill}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className={classes.rating_count}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={classes.reviews_list}>
        <h3 className={classes.section_title}>All Reviews</h3>
        {reviews.length === 0 ? (
          <div className={classes.empty_state}>
            <p>No reviews yet</p>
          </div>
        ) : (
          <div className={classes.reviews_grid}>
            {reviews.map((review) => (
              <div key={review.id} className={classes.review_card}>
                <div className={classes.review_header}>
                  <div className={classes.user_info}>
                    <span className={classes.user_name}>User #{review.user_id.slice(0, 8)}</span>
                    <span className={classes.review_date}>
                      {new Date(review.created).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={classes.review_rating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`${classes.star_small} ${star <= review.rating ? classes.filled : ''}`}
                        fill={star <= review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className={classes.review_comment}>{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

