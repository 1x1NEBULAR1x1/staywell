import classes from './AdditionalOptions.module.scss';
import { ExtendedBookingAdditionalOption } from '@shared/src';
import { Package, Edit } from 'lucide-react';
import { useState } from 'react';
import { EditOptionsModal } from './components';

export const AdditionalOptions = ({
  booking_additional_options,
  booking_id,
  refetch
}: {
  booking_additional_options: ExtendedBookingAdditionalOption[],
  booking_id: string,
  refetch: () => void
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const totalOptionsPrice = booking_additional_options.reduce(
    (total, option) => total + (option.additional_option.price * option.amount),
    0
  );

  return (
    <div className={classes.additional_options}>
      <div className={classes.header}>
        <Package className={classes.header_icon} />
        <h3 className={classes.title}>Additional Services</h3>
        <button
          className={classes.edit_button}
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit className={classes.edit_icon} />
          Edit Services
        </button>
      </div>

      <div className={classes.content}>
        {booking_additional_options.length === 0 ? (
          <div className={classes.no_options}>
            No additional services added
          </div>
        ) : (
          <>
            <div className={classes.options_list}>
              {booking_additional_options.map((bookingOption) => (
                <div key={bookingOption.id} className={classes.option_item}>
                  <div className={classes.option_info}>
                    <div className={classes.option_main}>
                      <span className={classes.option_name}>
                        {bookingOption.additional_option.name}
                      </span>
                      <div className={classes.option_details}>
                        <span className={classes.option_amount}>
                          Quantity: {bookingOption.amount}
                        </span>
                        <span className={classes.option_price}>
                          ${bookingOption.additional_option.price} per unit
                        </span>
                      </div>
                    </div>

                    {bookingOption.additional_option.description && (
                      <p className={classes.option_description}>
                        {bookingOption.additional_option.description}
                      </p>
                    )}
                  </div>

                  <div className={classes.option_actions}>
                    <span className={classes.option_total}>
                      ${bookingOption.additional_option.price * bookingOption.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={classes.total_section}>
              <div className={classes.total_row}>
                <span className={classes.total_label}>
                  Total Additional Services:
                </span>
                <span className={classes.total_amount}>
                  ${totalOptionsPrice}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {isEditModalOpen && (
        <EditOptionsModal
          booking_id={booking_id}
          current_options={booking_additional_options}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            refetch();
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};