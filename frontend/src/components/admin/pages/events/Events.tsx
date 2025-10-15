'use client'

import { example_apartment } from '@shared/src';

import { EventCardShimmer, EventCard, FiltersMenu } from './components';
import { ListPage } from '@/components/admin/common/AdminPage';


export const Events = () => (
  <ListPage
    model="EVENT"
    filters_menu={<FiltersMenu />}
    render_item={(event) => <EventCard key={event.id} event={event} />}
    shimmer_item={(key) => <EventCardShimmer key={key} />}
    columns={['Name', 'Status', 'Type', 'Created']}
    sort_by_list={Object.keys(example_apartment).filter((key) => !['image', 'rules'].includes(key)).sort()}
  />
)