'use client'

import { example_event } from '@shared/src';

import { EventRowShimmer, EventRow } from './components';
import { ListPage } from '@/components/admin/common/AdminPage';
import { filters_config, columns } from './config';
import { EventModal } from './EventModal';


export const Events = () => (
  <ListPage
    model="EVENT"
    create_modal={<EventModal />}
    filters_config={filters_config}
    render_item={(event) => <EventRow key={event.id} event={event} />}
    shimmer_item={(key) => <EventRowShimmer key={key} />}
    columns={columns}
    sort_by_list={Object.keys(example_event).filter((key) => !['image', 'description'].includes(key)).sort()}
  />
)