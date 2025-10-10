import classes from './ApartmentAmenities.module.scss';

import { ExtendedApartment, ExtendedAmenity } from '@shared/src';
import { AddButton } from '../AddButton';
import { useState, useEffect, useRef } from 'react';
import { Amenity, Dropdown, AmenityModal } from './components';

export const ApartmentAmenities = ({ apartment, refetch }: { apartment: ExtendedApartment, refetch: () => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [is_add_amenity_modal_open, setIsAddAmenityModalOpen] = useState(false);
  const [showExcluded, setShowExcluded] = useState(false);
  const [editing_amenity, setEditingAmenity] = useState<ExtendedAmenity | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className={classes.amenities}>
      <span className={classes.amenities_label}>Amenities</span>
      <div className={classes.amenities_content}>
        {apartment.apartment_amenities.map((amenity) => (
          <Amenity key={amenity.id} amenity={amenity} refetch={refetch} />
        ))}
        <div className={classes.add_container} ref={dropdownRef}>
          <AddButton onClick={() => setIsDropdownOpen(!isDropdownOpen)} size={32} />
          {isDropdownOpen && (
            <Dropdown
              apartment={apartment}
              setIsDropdownOpen={setIsDropdownOpen}
              refetch={refetch}
              setIsAddAmenityModalOpen={setIsAddAmenityModalOpen}
              showExcluded={showExcluded}
              setShowExcluded={setShowExcluded}
              setEditingAmenity={setEditingAmenity}
            />
          )}
        </div>
        {(is_add_amenity_modal_open || editing_amenity) && (
          <AmenityModal
            onClose={() => {
              setIsAddAmenityModalOpen(false);
              setEditingAmenity(undefined);
            }}
            refetch={refetch}
            editing_amenity={editing_amenity}
          />
        )}
      </div>
    </div>
  );
};
