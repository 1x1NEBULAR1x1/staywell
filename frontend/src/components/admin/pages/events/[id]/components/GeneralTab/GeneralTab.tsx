'use client';

import { useState } from 'react';
import classes from './GeneralTab.module.scss';
import { ExtendedEvent } from '@shared/src/types';
import { MainData, MetaData, EditEventModal } from './components';
import { Calendar, Clock } from 'lucide-react';
import { useModel } from '@/hooks/admin/queries/useModel';

export const GeneralTab = ({ event }: { event: ExtendedEvent }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { refetch } = useModel('EVENT').find(event.id);

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <>
      <div className={classes.general_tab}>
        {/* Header Section */}
        <div className={classes.header_section}>
          <MainData event={event} setIsEditModalOpen={setIsEditModalOpen} />
          <MetaData event={event} />
        </div>

        {/* Schedule Section */}
        <div className={classes.info_section}>
          <h3 className={classes.section_title}>Schedule</h3>
          <div className={classes.schedule_grid}>
            <div className={classes.schedule_item}>
              <div className={classes.schedule_icon}>
                <Calendar size={20} />
              </div>
              <div className={classes.schedule_content}>
                <span className={classes.schedule_label}>Start Date</span>
                <span className={classes.schedule_value}>
                  {startDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className={classes.schedule_time}>
                  {startDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>

            <div className={classes.schedule_item}>
              <div className={classes.schedule_icon}>
                <Calendar size={20} />
              </div>
              <div className={classes.schedule_content}>
                <span className={classes.schedule_label}>End Date</span>
                <span className={classes.schedule_value}>
                  {endDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className={classes.schedule_time}>
                  {endDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>

            <div className={classes.schedule_item}>
              <div className={classes.schedule_icon}>
                <Clock size={20} />
              </div>
              <div className={classes.schedule_content}>
                <span className={classes.schedule_label}>Duration</span>
                <span className={classes.schedule_value}>
                  {duration} {duration === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {event.description && (
          <div className={classes.info_section}>
            <h3 className={classes.section_title}>Description</h3>
            <p className={classes.description}>{event.description}</p>
          </div>
        )}

        {/* Guide Section */}
        {event.guide && (
          <div className={classes.info_section}>
            <h3 className={classes.section_title}>Tour Guide</h3>
            <div className={classes.guide_card}>
              <div className={classes.guide_avatar}>
                <span className={classes.guide_initials}>
                  {event.guide.first_name[0]}{event.guide.last_name[0]}
                </span>
              </div>
              <div className={classes.guide_info}>
                <h4 className={classes.guide_name}>
                  {event.guide.first_name} {event.guide.last_name}
                </h4>
                <p className={classes.guide_email}>{event.guide.email}</p>
                {event.guide.phone_number && (
                  <p className={classes.guide_phone}>{event.guide.phone_number}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Capacity & Pricing */}
        <div className={classes.stats_section}>
          <div className={classes.stat_card}>
            <div className={classes.stat_header}>
              <span className={classes.stat_label}>Total Capacity</span>
            </div>
            <div className={classes.stat_value}>{event.capacity} people</div>
            <div className={classes.stat_hint}>Maximum participants</div>
          </div>

          <div className={classes.stat_card}>
            <div className={classes.stat_header}>
              <span className={classes.stat_label}>Price per Person</span>
            </div>
            <div className={classes.stat_value}>${event.price}</div>
            <div className={classes.stat_hint}>Per participant</div>
          </div>

          <div className={classes.stat_card}>
            <div className={classes.stat_header}>
              <span className={classes.stat_label}>Total Revenue Potential</span>
            </div>
            <div className={classes.stat_value}>${(event.price * event.capacity).toFixed(2)}</div>
            <div className={classes.stat_hint}>At full capacity</div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditEventModal
          event={event}
          onClose={() => setIsEditModalOpen(false)}
          refetch={refetch}
        />
      )}
    </>
  );
};

