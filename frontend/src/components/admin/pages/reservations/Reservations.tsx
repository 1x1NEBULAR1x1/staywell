'use client';
import { ReservationCard, ReservationCardShimmer } from './components';
import { ListPage } from '../../common/AdminPage';
import { example_reservation } from '@shared/src';

export const Reservations = () => (
  <ListPage
    model="RESERVATION"
    type='cards'
    filters_config={{
      min_start: { 
        type: 'date',
        label: 'Start Date From'
      },
      max_start: { 
        type: 'date',
        label: 'Start Date To'
      },
      min_end: { 
        type: 'date',
        label: 'End Date From'
      },
      max_end: { 
        type: 'date',
        label: 'End Date To'
      },
    }}
    render_item={(reservation) => <ReservationCard key={reservation.id} reservation={reservation} />}
    shimmer_item={(key) => <ReservationCardShimmer key={key} />}
    columns={[
      { label: 'Apartment', field: 'apartment_id' },
      { label: 'User', field: 'user_id' },
      { label: 'Start', field: 'start_date' },
      { label: 'End', field: 'end_date' },
      { label: 'Created', field: 'created' }
    ]}
    sort_by_list={Object.keys(example_reservation).sort()}
  />
);