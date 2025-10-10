'use client';
import { BookingCard, BookingCardShimmer, FiltersMenu } from './components';
import { ListPage } from '../../common/AdminPage';
import { example_booking } from '@shared/src';

type BookingsProps = {}

export const Bookings = ({ }: BookingsProps) => (
  <ListPage
    model="BOOKING"
    type='cards'
    filters_menu={<FiltersMenu />}
    render_item={(booking) => <BookingCard key={booking.id} booking={booking} />}
    shimmer_item={(key) => <BookingCardShimmer key={key} />}
    columns={['Apartment', 'User', 'Status', 'Start', 'End', 'Created']}
    sort_by_list={Object.keys(example_booking).filter((key) => !['transaction_id'].includes(key)).sort()}
  />
);