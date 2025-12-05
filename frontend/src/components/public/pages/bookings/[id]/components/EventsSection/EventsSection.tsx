"use client";
import type { ExtendedBookingEvent } from "@shared/src";
import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import no_image from "@/../public/common/no-image.jpeg";
import { Shimmer } from "@/components/styles/ui/Shimmer";
import { getImageUrl } from "@/lib/api/utils/image-url";
import classes from "./EventsSection.module.scss";

export const EventsSection = ({
  booking_events,
}: {
  booking_events?: ExtendedBookingEvent[];
}) => {
  const eventsTotal =
    booking_events?.reduce((total, event) => total + event.event.price, 0) ?? 0;

  return !booking_events ? (
    <EventsSectionShimmer />
  ) : (
    booking_events.length > 0 && (
      <div className={classes.events_section}>
        <h3 className={classes.title}>Selected Events</h3>

        <div className={classes.events_container}>
          <div className={classes.events_list}>
            <div className={classes.events_grid}>
              {booking_events.map((event) => (
                <div key={event.id} className={classes.event_card}>
                  <div className={classes.event_image}>
                    <Image
                      src={getImageUrl(event.event.image) || no_image.src}
                      alt={event.event.name}
                      width={120}
                      height={80}
                      className={classes.image}
                    />
                    <div className={classes.price_badge}>
                      ${event.event.price}
                    </div>
                  </div>

                  <div className={classes.event_info}>
                    <h4 className={classes.event_name}>{event.event.name}</h4>

                    <div className={classes.event_detail}>
                      <Calendar size={14} />
                      <span>
                        {format(new Date(event.event.start), "MMM dd, HH:mm")} -{" "}
                        {format(new Date(event.event.end), "HH:mm")}
                      </span>
                    </div>

                    <div className={classes.event_detail}>
                      <MapPin size={14} />
                      <span>{event.event.capacity} spots available</span>
                    </div>

                    <div className={classes.event_detail}>
                      <Users size={14} />
                      <span>{event.number_of_people} people</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={classes.events_summary}>
            <div className={classes.summary_card}>
              <h4 className={classes.summary_title}>Events Total</h4>
              <div className={classes.summary_amount}>
                <span className={classes.amount}>
                  ${eventsTotal.toFixed(2)}
                </span>
                <span className={classes.events_count}>
                  {booking_events.length} event
                  {booking_events.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className={classes.summary_breakdown}>
                {booking_events.map((event) => (
                  <div key={event.id} className={classes.breakdown_item}>
                    <span className={classes.item_name}>
                      {event.event.name}
                    </span>
                    <span className={classes.item_price}>
                      ${event.event.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const EventsSectionShimmer = () => (
  <div className={classes.events_section}>
    <Shimmer
      className={classes.shimmer_title}
      style={{ height: "32px", width: "180px", marginBottom: "32px" }}
    />

    <div className={classes.events_container}>
      <div className={classes.events_list}>
        <div className={classes.events_grid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={classes.event_card}>
              <div className={classes.event_image}>
                <Shimmer
                  className={classes.shimmer_image}
                  style={{ width: "100%", height: "120px" }}
                />
                <div className={classes.price_badge}>
                  <Shimmer
                    className={classes.shimmer_price_badge}
                    style={{ height: "20px", width: "50px" }}
                  />
                </div>
              </div>

              <div className={classes.event_info}>
                <Shimmer
                  className={classes.shimmer_event_name}
                  style={{
                    height: "20px",
                    width: "140px",
                    marginBottom: "12px",
                  }}
                />

                <div className={classes.event_detail}>
                  <Shimmer
                    className={classes.shimmer_icon}
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                    }}
                  />
                  <Shimmer
                    className={classes.shimmer_detail_text}
                    style={{ height: "14px", width: "120px" }}
                  />
                </div>

                <div className={classes.event_detail}>
                  <Shimmer
                    className={classes.shimmer_icon}
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                    }}
                  />
                  <Shimmer
                    className={classes.shimmer_detail_text}
                    style={{ height: "14px", width: "100px" }}
                  />
                </div>

                <div className={classes.event_detail}>
                  <Shimmer
                    className={classes.shimmer_icon}
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                    }}
                  />
                  <Shimmer
                    className={classes.shimmer_detail_text}
                    style={{ height: "14px", width: "80px" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={classes.events_summary}>
        <div className={classes.summary_card}>
          <Shimmer
            className={classes.shimmer_summary_title}
            style={{ height: "20px", width: "120px", marginBottom: "16px" }}
          />

          <div className={classes.summary_amount}>
            <Shimmer
              className={classes.shimmer_amount}
              style={{ height: "32px", width: "80px" }}
            />
            <Shimmer
              className={classes.shimmer_events_count}
              style={{ height: "16px", width: "60px" }}
            />
          </div>

          <div className={classes.summary_breakdown}>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className={classes.breakdown_item}>
                <Shimmer
                  className={classes.shimmer_item_name}
                  style={{ height: "16px", width: "100px" }}
                />
                <Shimmer
                  className={classes.shimmer_item_price}
                  style={{ height: "16px", width: "40px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
