import classes from './AmenityItem.module.scss';
import no_image from '@/../public/common/no-image.jpeg';
import { useModel } from '@/hooks/admin/queries';

import { ExtendedAmenity } from '@shared/src';
import Image from 'next/image';
import { X, ArchiveRestore, Trash2, Edit } from 'lucide-react';
import { isAxiosError } from 'axios';
import { useToast } from '@/hooks/common';
import { ToolTip } from '@/components/styles/ui/ToolTip/ToolTip';

interface AmenityItemProps {
  amenity: ExtendedAmenity,
  handleAddAmenity: (amenity: ExtendedAmenity) => void,
  refetch_amenities: () => void,
  setEditingAmenity: (amenity?: ExtendedAmenity) => void
}

export const AmenityItem = ({ amenity, handleAddAmenity: handleAddAmenityFn, refetch_amenities, setEditingAmenity }: AmenityItemProps) => {
  const remove_mutation = useModel('AMENITY').remove(amenity.id)
  const update_mutation = useModel('AMENITY').update(amenity.id)
  const toast = useToast();

  const handleAddAmenity = async (e: React.MouseEvent<HTMLDivElement>) => {
    await handleRestoreAmenity(e);
    handleAddAmenityFn(amenity);
  }

  const handleRestoreAmenity = async (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    try {
      await update_mutation.mutateAsync({ is_excluded: false });
      toast.success('Amenity has been updated successfully');
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during restoration: ${error.message}`);
      console.error('Failed to restore amenity:', error);
    }
    refetch_amenities();
  }

  const handleEditAmenity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditingAmenity(amenity);
  }

  const handleRemoveAmenity = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await remove_mutation.mutateAsync();
      toast.success('Amenity has been removed successfully');
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during removal: ${error.message}`);
      console.error('Failed to remove amenity:', error);
    }
    refetch_amenities();
  }

  return (
    <div
      key={amenity.id}
      className={classes.amenity_item}
      onClick={handleAddAmenity}
    >
      <Image
        src={amenity.image || no_image.src}
        alt={amenity.name}
        width={24}
        height={24}
        className={classes.amenity_item_icon}
      />
      <span className={classes.amenity_item_name}>{amenity.name}</span>
      {amenity.is_excluded && (
        <button
          className={classes.restore_button}
          onClick={handleRestoreAmenity}
          type="button"
        >
          <ToolTip label="Restore" variant='green' position="bottom">
            <ArchiveRestore size={12} />
          </ToolTip>
        </button>
      )}
      {!amenity.is_excluded && (
        <button
          className={classes.edit_button}
          onClick={handleEditAmenity}
          type="button"
        >
          <ToolTip label="Edit" variant='main' position="bottom">
            <Edit size={12} />
          </ToolTip>
        </button>
      )}
      <button
        className={classes.delete_button}
        onClick={handleRemoveAmenity}
        type="button"
      >
        <ToolTip label={amenity.is_excluded ? "Remove" : "Mark as excluded"} variant='red' position="bottom">
          {amenity.is_excluded ? <Trash2 size={12} /> : <X size={12} />}
        </ToolTip>
      </button>
    </div>
  )
};
