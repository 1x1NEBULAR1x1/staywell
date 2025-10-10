import classes from './ApartmentBeds.module.scss';

import { ExtendedApartment, BedType } from '@shared/src';
import { AddButton } from '../AddButton';
import { useState, useEffect, useRef, useMemo } from 'react';
import { BedTypeModal, Dropdown, ApartmentBed } from './components';
import { useModel } from '@/hooks/admin/queries/useModel';


export const ApartmentBeds = ({ apartment, refetch: refetch_apartment }: { apartment: ExtendedApartment, refetch: () => void }) => {
  const [is_dropdown_open, setIsDropdownOpen] = useState(false);
  const [is_bed_type_modal_open, setIsBedTypeModalOpen] = useState(false);
  const [show_excluded, setShowExcluded] = useState(false);
  const [editing_bed_type, setEditingBedType] = useState<BedType | undefined>(undefined);
  const dropdown_ref = useRef<HTMLDivElement>(null);


  const { data: bed_types, refetch: refetch_bed_types } = useModel('BED_TYPE').get({ skip: 0, take: 1000, is_excluded: show_excluded });


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdown_ref.current && !dropdown_ref.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const available_bed_types = useMemo(() => bed_types?.items.filter(
    bedType => !apartment.apartment_beds.some(apartment_bed => apartment_bed.bed_type_id === bedType.id)
  ) || [], [bed_types, apartment]);


  return (
    <div className={classes.beds}>
      <span className={classes.beds_label}>Beds</span>
      <div className={classes.beds_content}>
        {apartment.apartment_beds.map((bed) => (
          <ApartmentBed key={bed.id} bed={bed} refetch_apartment={refetch_apartment} />
        ))}
        <div className={classes.add_container} ref={dropdown_ref}>
          <AddButton onClick={() => setIsDropdownOpen(!is_dropdown_open)} size={32} />
          {is_dropdown_open && (
            <Dropdown
              bed_types={available_bed_types}
              apartment_id={apartment.id}
              setIsBedTypeModalOpen={setIsBedTypeModalOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              refetch_apartment={refetch_apartment}
              refetch_bed_types={refetch_bed_types}
              show_excluded={show_excluded}
              setShowExcluded={setShowExcluded}
              setEditingBedType={setEditingBedType}
            />
          )}
        </div>
        {(is_bed_type_modal_open || editing_bed_type) && (
          <BedTypeModal
            onClose={() => {
              setIsBedTypeModalOpen(false);
              setEditingBedType(undefined);
            }}
            refetch_bed_types={refetch_bed_types}
            editing_bed_type={editing_bed_type}
          />
        )}
      </div>
    </div>
  );
};
