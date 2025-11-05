'use client'

import { example_review } from '@shared/src';

import { ReviewCard, ReviewCardShimmer } from './components';
import { ListPage } from '@/components/admin/common/AdminPage';


export const Reviews = () => (
  <ListPage
    model="REVIEW"
    filters_config={{
      rating: {
        type: 'integer',
        placeholder: 'Filter by rating...',
        min: 1,
        max: 5
      },
      comment: {
        type: 'string',
        placeholder: 'Search in comments...'
      },
    }}
    render_item={(review) => <ReviewCard key={review.id} review={review} />}
    shimmer_item={(key) => <ReviewCardShimmer key={key} />}
    columns={[
      { label: 'Name', field: 'user_id' },
      { label: 'Rating', field: 'rating' },
      { label: 'Status', field: 'is_excluded' },
      { label: 'Created', field: 'created' }
    ]}
    sort_by_list={Object.keys(example_review).filter((key) => !['user', 'apartment'].includes(key)).sort()}
  />
)