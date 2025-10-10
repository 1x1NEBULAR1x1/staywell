import { useModel } from '@/hooks/admin/queries/useModel';
import classes from './Dropdown.module.scss';

import { BedType as BedTypeType } from '@shared/src';
import { BedType } from './components';
import { Eye, EyeOff, PlusIcon } from 'lucide-react';

interface DropdownProps {
  bed_types: BedTypeType[];
  apartment_id: string;
  setIsBedTypeModalOpen: (isAddBedTypeModalOpen: boolean) => void;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
  refetch_apartment: () => void;
  refetch_bed_types: () => void;
  show_excluded: boolean;
  setShowExcluded: (showExcluded: boolean) => void;
  setEditingBedType: (bedType: BedTypeType | undefined) => void;
}

export const Dropdown = ({
  bed_types,
  apartment_id,
  setIsBedTypeModalOpen,
  setIsDropdownOpen,
  refetch_apartment,
  refetch_bed_types,
  show_excluded,
  setShowExcluded,
  setEditingBedType
}: DropdownProps) => {
  const create_mutation = useModel('APARTMENT_BED').create();


  const handleAddBed = async (bedType: BedTypeType) => {
    try {
      await create_mutation.mutateAsync({
        apartment_id,
        bed_type_id: bedType.id,
        count: 1,
      });
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to add bed:', error);
    } finally {
      refetch_apartment();
    }
  };


  return (
    <div className={classes.dropdown}>
      {bed_types.length === 0 ? (
        <div className={classes.no_items}>
          {show_excluded ? 'No excluded bed types' : 'All bed types have been added'}
        </div>
      ) : (
        bed_types.map((bed_type) => <BedType key={bed_type.id} bed_type={bed_type} handleAddBed={handleAddBed} refetch_bed_types={refetch_bed_types} setEditingBedType={setEditingBedType} />)
      )}
      <button
        className={classes.dropdown_button}
        onClick={() => setShowExcluded(!show_excluded)}
      >
        {show_excluded ? <EyeOff size={16} /> : <Eye size={16} />}
        {show_excluded ? 'Hide Excluded' : 'Show Excluded'}
      </button>
      <button
        className={classes.dropdown_button}
        onClick={() => setIsBedTypeModalOpen(true)}
      >
        <PlusIcon size={16} />
        Add Bed Type
      </button>
    </div>
  )
};