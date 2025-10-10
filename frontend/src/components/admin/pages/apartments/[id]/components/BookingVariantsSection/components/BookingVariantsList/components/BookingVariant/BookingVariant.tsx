import classes from './BookingVariant.module.scss';

import { BookingVariant as BookingVariantType, CruddableTypes } from '@shared/src';
import { useModel } from '@/hooks/admin/queries';
import { useToast } from '@/hooks/common';
import { isAxiosError } from 'axios';

export const BookingVariant = ({ booking_variant, refetch }: { booking_variant: BookingVariantType, refetch: () => void }) => {
  const toast = useToast()
  const { update, remove } = useModel("BOOKING_VARIANT")
  const [update_mutation, remove_mutation] = [update(booking_variant.id), remove(booking_variant.id)]

  const handleUpdate = async (data: CruddableTypes<'BOOKING_VARIANT'>['update']) => {
    try {
      await update_mutation.mutateAsync(data)
      refetch()
      toast.success('Booking variant has been updated successfully')
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during update: ${error.message}`)
      console.error(error)
    }
  }
  const handleRemove = async () => {
    await remove_mutation.mutateAsync()
    refetch()
  }


  return (
    <div key={booking_variant.id} className={classes.variant_item}>
      <div className={classes.variant_info}>
        <div className={classes.variant_details}>
          <span className={classes.price}>${booking_variant.price.toFixed(2)}/night</span>
          <span className={classes.capacity}>{booking_variant.capacity} guests</span>
        </div>

        <div className={classes.variant_controls}>
          <div className={classes.control_group}>
            <label className={classes.control_label}>Price:</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={booking_variant.price}
              onChange={(e) => handleUpdate({ price: parseFloat(e.target.value) || 0 })}
              className={classes.control_input}
              disabled={update_mutation.isPending}
            />
          </div>

          <div className={classes.control_group}>
            <label className={classes.control_label}>Capacity:</label>
            <input
              type="number"
              min="1"
              value={booking_variant.capacity}
              onChange={(e) => handleUpdate({ capacity: parseInt(e.target.value) || 1 })}
              className={classes.control_input}
              disabled={update_mutation.isPending}
            />
          </div>
        </div>
      </div>

      <div className={classes.variant_actions}>
        <button
          className={`${classes.availability_button} ${booking_variant.is_available ? classes.available : classes.unavailable}`}
          onClick={() => handleUpdate({ is_available: !booking_variant.is_available })}
          disabled={update_mutation.isPending}
        >
          {booking_variant.is_available ? 'Available' : 'Unavailable'}
        </button>

        <button
          className={classes.remove_button}
          onClick={handleRemove}
          disabled={remove_mutation.isPending}
        >
          Remove
        </button>
      </div>
    </div>
  )
};