import { useModel } from '@/hooks/admin/queries/useModel';
import classes from './Dropdown.module.scss';

import { ExtendedAmenity, ExtendedApartment } from '@shared/src';
import { AmenityItem } from './components';
import { Eye, EyeOff, PlusIcon } from 'lucide-react';

interface DropdownProps {
  apartment: ExtendedApartment;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
  refetch: () => void;
  setIsAddAmenityModalOpen: (isAddAmenityModalOpen: boolean) => void;
  showExcluded: boolean;
  setShowExcluded: (showExcluded: boolean) => void;
  setEditingAmenity: (amenity?: ExtendedAmenity) => void;
}

export const Dropdown = ({
  apartment,
  setIsDropdownOpen,
  refetch,
  setIsAddAmenityModalOpen,
  showExcluded,
  setShowExcluded,
  setEditingAmenity
}: DropdownProps) => {
  const { data: amenities, refetch: refetch_amenities } = useModel('AMENITY').get({ skip: 0, take: 1000, is_excluded: showExcluded });

  const available_amenities = amenities?.items.filter(
    amenity => !apartment.apartment_amenities.some(apartmentAmenity => apartmentAmenity.amenity_id === amenity.id)
  ) || [];

  const create_mutation = useModel('APARTMENT_AMENITY').create();

  const handleAddAmenity = async (amenity: ExtendedAmenity) => {
    try {
      await create_mutation.mutateAsync({
        apartment_id: apartment.id,
        amenity_id: amenity.id,
      });
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to add amenity:', error);
    }
    refetch();
  };

  return (
    <div className={classes.dropdown}>
      {available_amenities?.length === 0 ? (
        <div className={classes.no_items}>
          {showExcluded ? 'No excluded amenities' : 'No amenities available'}
        </div>
      ) : (
        available_amenities?.map((amenity) => (
          <AmenityItem
            key={amenity.id}
            amenity={amenity}
            handleAddAmenity={handleAddAmenity}
            refetch_amenities={refetch_amenities}
            setEditingAmenity={setEditingAmenity}
          />
        ))
      )}
      <button
        className={classes.dropdown_button}
        onClick={() => setShowExcluded(!showExcluded)}
      >
        {showExcluded ? <EyeOff size={16} /> : <Eye size={16} />}
        {showExcluded ? 'Hide Excluded' : 'Show Excluded'}
      </button>
      <button
        className={classes.dropdown_button}
        onClick={() => setIsAddAmenityModalOpen(true)}
      >
        <PlusIcon size={16} />
        Add Amenity
      </button>
    </div>
  )
};