'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useModel } from '@/hooks/admin/queries/useModel';
import { ExtendedApartment, BedType as BedTypeType } from '@shared/src';
import classes from './BedsTab.module.scss';
import { ApartmentBed, BedTypeModal } from './components';
import { Plus, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export const BedsTab = ({ apartment }: { apartment: ExtendedApartment }) => {
  const { id } = useParams();
  const { refetch: refetch_apartment } = useModel('APARTMENT').find(id as string);
  const [show_excluded, setShowExcluded] = useState(false);
  const [is_bed_type_modal_open, setIsBedTypeModalOpen] = useState(false);
  const [editing_bed_type, setEditingBedType] = useState<BedTypeType | undefined>(undefined);
  const [show_available_beds, setShowAvailableBeds] = useState(true);

  const { data: bed_types } = useModel('BED_TYPE').get({
    skip: 0,
    take: 1000,
    is_excluded: show_excluded
  });

  const create_mutation = useModel('APARTMENT_BED').create();

  const available_bed_types = bed_types?.items.filter(
    bedType => !apartment?.apartment_beds.some(
      apartment_bed => apartment_bed.bed_type_id === bedType.id
    )
  ) || [];

  const handleAddBed = async (bedType: BedTypeType) => {
    try {
      await create_mutation.mutateAsync({
        apartment_id: id as string,
        bed_type_id: bedType.id,
        count: 1,
      });
      refetch_apartment();
    } catch (error) {
      console.error('Failed to add bed:', error);
    }
  };

  return (
    <div className={classes.beds_tab}>
      {/* Current Beds Section */}
      <div className={classes.section}>
        <div className={classes.section_header}>
          <h3 className={classes.section_title}>Current Beds Configuration</h3>
          <p className={classes.section_subtitle}>
            Manage the types and quantities of beds in this apartment
          </p>
        </div>

        {apartment.apartment_beds.length === 0 ? (
          <div className={classes.empty_state}>
            <p>No beds configured yet. Add some from the available bed types below.</p>
          </div>
        ) : (
          <div className={classes.beds_grid}>
            {apartment.apartment_beds.map((bed) => (
              <ApartmentBed key={bed.id} bed={bed} />
            ))}
          </div>
        )}
      </div>

      {/* Available Beds Section */}
      <div className={classes.section}>
        <div className={classes.section_header}>
          <div className={classes.header_content}>
            <h3 className={classes.section_title}>Available Bed Types</h3>
            <p className={classes.section_subtitle}>
              Click on a bed type to add it to this apartment
            </p>
          </div>
          <div className={classes.header_actions}>
            <button
              className={classes.toggle_button}
              onClick={() => setShowAvailableBeds(!show_available_beds)}
            >
              {show_available_beds ? 'Hide Available' : 'Show Available'}
            </button>
            <button
              className={classes.filter_button}
              onClick={() => setShowExcluded(!show_excluded)}
            >
              {show_excluded ? <EyeOff size={18} /> : <Eye size={18} />}
              {show_excluded ? 'Hide Excluded' : 'Show Excluded'}
            </button>
            <button
              className={classes.add_button}
              onClick={() => setIsBedTypeModalOpen(true)}
            >
              <Plus size={18} />
              Create New Bed Type
            </button>
          </div>
        </div>

        {show_available_beds && (
          <div className={classes.available_beds}>
            {available_bed_types.length === 0 ? (
              <div className={classes.empty_state}>
                <p>
                  {show_excluded
                    ? 'No excluded bed types available'
                    : 'All bed types have been added to this apartment'}
                </p>
              </div>
            ) : (
              <div className={classes.available_grid}>
                {available_bed_types.map((bed_type) => (
                  <div
                    key={bed_type.id}
                    className={classes.available_bed_card}
                    onClick={() => handleAddBed(bed_type)}
                  >
                    <div className={classes.bed_image_container}>
                      <Image
                        src={bed_type.image}
                        alt={bed_type.name}
                        width={100}
                        height={100}
                        className={classes.bed_image}
                      />
                    </div>
                    <div className={classes.bed_info}>
                      <span className={classes.bed_name}>{bed_type.name}</span>
                      <button className={classes.add_icon}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {(is_bed_type_modal_open || editing_bed_type) && (
        <BedTypeModal
          onClose={() => {
            setIsBedTypeModalOpen(false);
            setEditingBedType(undefined);
          }}
          editing_bed_type={editing_bed_type}
        />
      )}
    </div>
  );
};

