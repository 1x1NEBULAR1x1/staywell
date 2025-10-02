'use client'

import { example_review } from '@shared/src';

import { ReviewCard, ReviewCardShimmer, FiltersMenu } from './components';
import { ListPage } from '@/components/admin/common/AdminPage';


export const Reviews = () => (
  <ListPage
    model="REVIEW"
    filters_menu={<FiltersMenu />}
    render_item={(review) => <ReviewCard key={review.id} review={review} />}
    shimmer_item={(key) => <ReviewCardShimmer key={key} />}
    columns={['Name', 'Rating', 'Status', 'Created']}
    sort_by_list={Object.keys(example_review).filter((key) => !['user', 'apartment'].includes(key)).sort()}
  />
)