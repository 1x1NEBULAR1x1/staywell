"use client";
import type { ExtendedBookingAdditionalOption } from "@shared/src";
import { Settings } from "lucide-react";
import Image from "next/image";
import no_image from "@/../public/common/no-image.jpeg";
import { Shimmer } from "@/components/styles/ui";
import { getImageUrl } from "@/lib/api/utils/image-url";
import classes from "./OptionsSection.module.scss";

export const OptionsSection = ({
  booking_additional_options,
}: {
  booking_additional_options?: ExtendedBookingAdditionalOption[];
}) => {
  const optionsTotal =
    booking_additional_options?.reduce(
      (total, option) => total + option.additional_option.price,
      0,
    ) ?? 0;

  return !booking_additional_options ? (
    <OptionsSectionShimmer />
  ) : (
    booking_additional_options.length > 0 && (
      <div className={classes.options_section}>
        <div className={classes.options_container}>
          <div className={classes.options_list}>
            <h3 className={classes.section_title}>Additional Options</h3>
            <div className={classes.options_grid}>
              {booking_additional_options.map((option) => (
                <div key={option.id} className={classes.option_card}>
                  <div className={classes.option_image}>
                    <Image
                      src={
                        getImageUrl(option.additional_option.image) ||
                        no_image.src
                      }
                      alt={option.additional_option.name}
                      width={120}
                      height={80}
                      className={classes.image}
                    />
                    <div className={classes.price_badge}>
                      ${option.additional_option.price}
                    </div>
                  </div>

                  <div className={classes.option_info}>
                    <h4 className={classes.option_name}>
                      {option.additional_option.name}
                    </h4>
                    <p className={classes.option_description}>
                      {option.additional_option.description.length > 80
                        ? `${option.additional_option.description.substring(0, 80)}...`
                        : option.additional_option.description}
                    </p>
                    <div className={classes.option_quantity}>
                      <Settings size={14} />
                      <span>1 item</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={classes.options_summary}>
            <div className={classes.summary_card}>
              <h4 className={classes.summary_title}>Options Total</h4>
              <div className={classes.summary_amount}>
                <span className={classes.amount}>
                  ${optionsTotal.toFixed(2)}
                </span>
                <span className={classes.options_count}>
                  {booking_additional_options.length} option
                  {booking_additional_options.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className={classes.summary_breakdown}>
                {booking_additional_options.map((option) => (
                  <div key={option.id} className={classes.breakdown_item}>
                    <span className={classes.item_name}>
                      {option.additional_option.name}
                    </span>
                    <span className={classes.item_price}>
                      ${option.additional_option.price}
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

const OptionsSectionShimmer = () => (
  <div className={classes.options_section}>
    <div className={classes.options_container}>
      <div className={classes.options_list}>
        <Shimmer
          className={classes.shimmer_title}
          style={{ height: "32px", width: "200px", marginBottom: "32px" }}
        />

        <div className={classes.options_grid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={classes.option_card}>
              <div className={classes.option_image}>
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

              <div className={classes.option_info}>
                <Shimmer
                  className={classes.shimmer_option_name}
                  style={{
                    height: "20px",
                    width: "140px",
                    marginBottom: "12px",
                  }}
                />
                <Shimmer
                  className={classes.shimmer_description}
                  style={{
                    height: "16px",
                    width: "160px",
                    marginBottom: "12px",
                  }}
                />
                <div className={classes.option_quantity}>
                  <Shimmer
                    className={classes.shimmer_icon}
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                    }}
                  />
                  <Shimmer
                    className={classes.shimmer_quantity_text}
                    style={{ height: "14px", width: "60px" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={classes.options_summary}>
        <div className={classes.summary_card}>
          <Shimmer
            className={classes.shimmer_summary_title}
            style={{ height: "20px", width: "130px", marginBottom: "16px" }}
          />

          <div className={classes.summary_amount}>
            <Shimmer
              className={classes.shimmer_amount}
              style={{ height: "32px", width: "80px" }}
            />
            <Shimmer
              className={classes.shimmer_options_count}
              style={{ height: "16px", width: "70px" }}
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
