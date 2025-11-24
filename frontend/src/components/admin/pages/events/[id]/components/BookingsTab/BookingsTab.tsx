'use client';

import { ExtendedEvent } from '@shared/src';
import classes from './BookingsTab.module.scss';
import { Users, DollarSign, Calendar, AlertCircle } from 'lucide-react';

export const BookingsTab = ({ event }: { event: ExtendedEvent }) => {
  // For now, showing placeholder as booking_events is not loaded
  // In real implementation, you would need to fetch booking_events with related data
  const bookingsCount = 0;
  const totalParticipants = 0;
  const totalRevenue = 0;
  const availableSpots = event.capacity - totalParticipants;

  return (
    <div className={classes.bookings_tab}>
      {/* Summary Section */}
      <div className={classes.summary_section}>
        <div className={classes.stat_card}>
          <div className={classes.stat_icon}>
            <Calendar className={classes.icon} />
          </div>
          <div className={classes.stat_content}>
            <span className={classes.stat_label}>Total Bookings</span>
            <span className={classes.stat_value}>{bookingsCount}</span>
          </div>
        </div>

        <div className={classes.stat_card}>
          <div className={classes.stat_icon}>
            <Users className={classes.icon} />
          </div>
          <div className={classes.stat_content}>
            <span className={classes.stat_label}>Total Participants</span>
            <span className={classes.stat_value}>{totalParticipants}</span>
          </div>
        </div>

        <div className={classes.stat_card}>
          <div className={classes.stat_icon}>
            <DollarSign className={classes.icon} />
          </div>
          <div className={classes.stat_content}>
            <span className={classes.stat_label}>Total Revenue</span>
            <span className={classes.stat_value}>${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className={classes.stat_card}>
          <div className={classes.stat_icon}>
            <Users className={classes.icon} />
          </div>
          <div className={classes.stat_content}>
            <span className={classes.stat_label}>Available Spots</span>
            <span className={classes.stat_value}>{availableSpots}</span>
          </div>
        </div>
      </div>

      {/* Capacity Progress */}
      <div className={classes.capacity_section}>
        <div className={classes.capacity_header}>
          <h3 className={classes.section_title}>Event Capacity</h3>
          <span className={classes.capacity_text}>
            {totalParticipants} / {event.capacity} participants
          </span>
        </div>
        <div className={classes.progress_bar}>
          <div 
            className={classes.progress_fill} 
            style={{ width: `${(totalParticipants / event.capacity) * 100}%` }}
          />
        </div>
        <div className={classes.capacity_info}>
          <span className={classes.capacity_percentage}>
            {((totalParticipants / event.capacity) * 100).toFixed(1)}% filled
          </span>
          {availableSpots === 0 && (
            <span className={classes.capacity_full}>Event is full</span>
          )}
        </div>
      </div>

      {/* Bookings List */}
      <div className={classes.bookings_section}>
        <h3 className={classes.section_title}>Bookings List</h3>
        
        {bookingsCount === 0 ? (
          <div className={classes.empty_state}>
            <AlertCircle className={classes.empty_icon} />
            <h4 className={classes.empty_title}>No Bookings Yet</h4>
            <p className={classes.empty_text}>
              This event doesn't have any bookings yet. Bookings will appear here once users start registering.
            </p>
          </div>
        ) : (
          <div className={classes.bookings_list}>
            {/* Bookings will be displayed here when implemented */}
            <p className={classes.placeholder}>Bookings list will be displayed here</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className={classes.info_section}>
        <div className={classes.info_card}>
          <h4 className={classes.info_title}>About Event Bookings</h4>
          <ul className={classes.info_list}>
            <li>Users can book multiple spots per booking</li>
            <li>Each booking is linked to a transaction</li>
            <li>Bookings cannot exceed the event capacity</li>
            <li>Revenue is calculated based on price per person</li>
            <li>Event status updates automatically based on dates</li>
          </ul>
        </div>

        <div className={classes.info_card}>
          <h4 className={classes.info_title}>Pricing Information</h4>
          <div className={classes.pricing_details}>
            <div className={classes.pricing_row}>
              <span className={classes.pricing_label}>Price per person:</span>
              <span className={classes.pricing_value}>${event.price}</span>
            </div>
            <div className={classes.pricing_row}>
              <span className={classes.pricing_label}>Maximum capacity:</span>
              <span className={classes.pricing_value}>{event.capacity} people</span>
            </div>
            <div className={classes.pricing_row}>
              <span className={classes.pricing_label}>Potential revenue:</span>
              <span className={classes.pricing_value}>${(event.price * event.capacity).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

