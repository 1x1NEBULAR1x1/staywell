'use client';
import { BookingCard, BookingCardShimmer } from './components';
import { ListPage } from '../../common/AdminPage';
import { example_booking, BookingStatus } from '@shared/src';

type BookingsProps = {}

export const Bookings = ({ }: BookingsProps) => (
  <ListPage
    model="BOOKING"
    type='cards'
    filters_config={{
      status: { 
        type: 'enum', 
        options: Object.values(BookingStatus),
        placeholder: 'All Statuses'
      },
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
    render_item={(booking) => <BookingCard key={booking.id} booking={booking} />}
    shimmer_item={(key) => <BookingCardShimmer key={key} />}
    columns={[
      { label: 'Apartment', field: 'reservation_id' },
      { label: 'User', field: 'user_id' },
      { label: 'Status', field: 'status' },
      { label: 'Start', field: 'start_date' },
      { label: 'End', field: 'end_date' },
      { label: 'Created', field: 'created' }
    ]}
    sort_by_list={Object.keys(example_booking).filter((key) => !['transaction_id'].includes(key)).sort()}
  />
);