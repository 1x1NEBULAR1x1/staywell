'use client';

import { ExtendedEvent } from '@shared/src';
import { EventTab } from '../../Event';
import classes from './EventSidebar.module.scss';
import { Calendar, Star, Image as ImageIcon, Users } from 'lucide-react';
import Image from 'next/image';

interface EventSidebarProps {
  event: ExtendedEvent;
  activeTab: EventTab;
  setActiveTab: (tab: EventTab) => void;
}

const navItems = [
  { id: 'general', label: 'General Info', icon: Calendar },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'bookings', label: 'Bookings', icon: Users },
] as const;


export const EventSidebar = ({ event, activeTab, setActiveTab }: EventSidebarProps) => {
  const mainImage = event.images?.[0]?.image || event.image || '/common/no-image.jpeg';
  const bookingsCount = 0; // Will be calculated from booking_events when needed
  const isUpcoming = new Date(event.start) > new Date();
  const isPast = new Date(event.end) < new Date();
  const isActive = !isUpcoming && !isPast;

  const getStatusLabel = () => {
    if (isPast) return 'Completed';
    if (isActive) return 'Active';
    return 'Upcoming';
  };

  const getStatusClass = () => {
    if (isPast) return classes.completed;
    if (isActive) return classes.active;
    return classes.upcoming;
  };

  return (
    <div className={classes.sidebar}>
      <div className={classes.event_info}>
        <div className={classes.image_container}>
          <Image
            src={mainImage}
            alt={event.name || 'Event'}
            width={260}
            height={180}
            className={classes.main_image}
          />
          <div className={`${classes.status_badge} ${getStatusClass()}`}>
            {getStatusLabel()}
          </div>
        </div>

        <div className={classes.info_content}>
          <h2 className={classes.event_name}>{event.name}</h2>
          <p className={classes.event_date}>
            {new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}
          </p>

          <div className={classes.stats_grid}>
            <div className={classes.stat_item}>
              <span className={classes.stat_value}>{event.capacity}</span>
              <span className={classes.stat_label}>Capacity</span>
            </div>
            <div className={classes.stat_item}>
              <span className={classes.stat_value}>${event.price}</span>
              <span className={classes.stat_label}>Price</span>
            </div>
            <div className={classes.stat_item}>
              <span className={classes.stat_value}>{bookingsCount}</span>
              <span className={classes.stat_label}>Bookings</span>
            </div>
            <div className={classes.stat_item}>
              <span className={classes.stat_value}>{event.images?.length || 0}</span>
              <span className={classes.stat_label}>Images</span>
            </div>
          </div>

          {event.guide && (
            <div className={classes.guide_info}>
              <span className={classes.guide_label}>Guide:</span>
              <span className={classes.guide_name}>
                {event.guide.first_name} {event.guide.last_name}
              </span>
            </div>
          )}
        </div>
      </div>

      <nav className={classes.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`${classes.nav_button} ${activeTab === item.id ? classes.active : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className={classes.nav_icon} />
              <span className={classes.nav_label}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

