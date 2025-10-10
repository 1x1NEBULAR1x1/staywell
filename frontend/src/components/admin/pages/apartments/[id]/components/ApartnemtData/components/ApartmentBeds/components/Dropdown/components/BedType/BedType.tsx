import classes from './BedType.module.scss';
import no_image from '@/../public/common/no-image.jpeg';
import { useModel } from '@/hooks/admin/queries';

import { BedType as BedTypeType } from '@shared/src';
import Image from 'next/image';
import { X, ArchiveRestore, Trash2, Edit } from 'lucide-react';
import { isAxiosError } from 'axios';
import { useToast } from '@/hooks/common';
import { ToolTip } from '@/components/styles/ui/ToolTip/ToolTip';

interface BedTypeProps {
  bed_type: BedTypeType,
  handleAddBed: (bed_type: BedTypeType) => void,
  refetch_bed_types: () => void,
  setEditingBedType: (bedType: BedTypeType | undefined) => void
}

export const BedType = ({ bed_type, handleAddBed: handleAddBedFn, refetch_bed_types, setEditingBedType }: BedTypeProps) => {
  const remove_mutation = useModel('BED_TYPE').remove(bed_type.id)
  const update_mutation = useModel('BED_TYPE').update(bed_type.id)
  const toast = useToast();

  const handleAddBed = async (e: React.MouseEvent<HTMLDivElement>) => {
    await handleRestoreBedType(e);
    handleAddBedFn(bed_type);
  }

  const handleRestoreBedType = async (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    try {
      await update_mutation.mutateAsync({ is_excluded: false });
      toast.success('Bed type has been updated successfully');
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during restoration: ${error.message}`);
      console.error('Failed to restore bed type:', error);
    }
    refetch_bed_types();
  }

  const handleEditBedType = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditingBedType(bed_type);
  }

  const handleRemoveBedType = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await remove_mutation.mutateAsync();
      toast.success('Bed type has been removed successfully');
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during removal: ${error.message}`);
      console.error('Failed to remove bed type:', error);
    }
    refetch_bed_types();
  }

  return (
    <div
      key={bed_type.id}
      className={classes.bed_type}
      onClick={handleAddBed}
    >
      <Image
        src={bed_type.image || no_image.src}
        alt={bed_type.name}
        width={24}
        height={24}
        className={classes.bed_type_icon}
      />
      <span className={classes.bed_type_name}>{bed_type.name}</span>
      {bed_type.is_excluded ? (
        <button
          className={classes.restore_button}
          onClick={handleRestoreBedType}
          type="button"
        >
          <ToolTip label="Restore" variant='green' position="bottom">
            <ArchiveRestore size={12} />
          </ToolTip>
        </button>
      ) : (
        <button
          className={classes.edit_button}
          onClick={handleEditBedType}
          type="button"
        >
          <ToolTip label="Edit" variant='main' position="bottom">
            <Edit size={12} />
          </ToolTip>
        </button>
      )}
      <button
        className={classes.delete_button}
        onClick={handleRemoveBedType}
        type="button"
      >
        <ToolTip label={bed_type.is_excluded ? "Remove" : "Mark as excluded"} variant='red' position="bottom">
          {bed_type.is_excluded ? <Trash2 size={12} /> : <X size={12} />}
        </ToolTip>
      </button>
    </div>
  )
};