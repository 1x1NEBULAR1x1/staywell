'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useModel } from '@/hooks/admin/queries/useModel';
import { ExtendedApartment, ExtendedAmenity } from '@shared/src';
import classes from './AmenitiesTab.module.scss';
import { Amenity, AmenityModal } from './components';
import { Plus, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { usePId } from '@/hooks/common/useId';

export const AmenitiesTab = ({ apartment }: { apartment: ExtendedApartment }) => {
  const id = usePId();
  const { refetch } = useModel('APARTMENT').find(id);
  const [show_excluded, setShowExcluded] = useState(false);
  const [is_add_amenity_modal_open, setIsAddAmenityModalOpen] = useState(false);
  const [editing_amenity, setEditingAmenity] = useState<ExtendedAmenity | undefined>(undefined);
  const [show_available_amenities, setShowAvailableAmenities] = useState(true);

  const { data: amenities } = useModel('AMENITY').get({
    skip: 0,
    take: 1000,
    is_excluded: show_excluded
  });

  const create_mutation = useModel('APARTMENT_AMENITY').create();

  const available_amenities = amenities?.items.filter(
    amenity => !apartment.apartment_amenities.some(
      apartmentAmenity => apartmentAmenity.amenity_id === amenity.id
    )
  ) || [];

  const handleAddAmenity = async (amenity: ExtendedAmenity) => {
    try {
      await create_mutation.mutateAsync({
        apartment_id: id as string,
        amenity_id: amenity.id,
      });
      refetch();
    } catch (error) {
      console.error('Failed to add amenity:', error);
    }
  };

  return (
    <div className={classes.amenities_tab}>
      {/* Current Amenities Section */}
      <div className={classes.section}>
        <div className={classes.section_header}>
          <h3 className={classes.section_title}>Current Amenities</h3>
          <p className={classes.section_subtitle}>
            Manage the amenities and facilities available in this apartment
          </p>
        </div>

        {apartment.apartment_amenities.length === 0 ? (
          <div className={classes.empty_state}>
            <p>No amenities added yet. Add some from the available amenities below.</p>
          </div>
        ) : (
          <div className={classes.amenities_grid}>
            {apartment.apartment_amenities.map((amenity) => (
              <Amenity key={amenity.id} amenity={amenity} refetch={refetch} />
            ))}
          </div>
        )}
      </div>

      {/* Available Amenities Section */}
      <div className={classes.section}>
        <div className={classes.section_header}>
          <div className={classes.header_content}>
            <h3 className={classes.section_title}>Available Amenities</h3>
            <p className={classes.section_subtitle}>
              Click on an amenity to add it to this apartment
            </p>
          </div>
          <div className={classes.header_actions}>
            <button
              className={classes.toggle_button}
              onClick={() => setShowAvailableAmenities(!show_available_amenities)}
            >
              {show_available_amenities ? 'Hide Available' : 'Show Available'}
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
              onClick={() => setIsAddAmenityModalOpen(true)}
            >
              <Plus size={18} />
              Create New Amenity
            </button>
          </div>
        </div>

        {show_available_amenities && (
          <div className={classes.available_amenities}>
            {available_amenities.length === 0 ? (
              <div className={classes.empty_state}>
                <p>
                  {show_excluded
                    ? 'No excluded amenities available'
                    : 'All amenities have been added to this apartment'}
                </p>
              </div>
            ) : (
              <div className={classes.available_grid}>
                {available_amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className={classes.available_amenity_card}
                    onClick={() => handleAddAmenity(amenity)}
                  >
                    <div className={classes.amenity_image_container}>
                      <Image
                        src={amenity.image}
                        alt={amenity.name}
                        width={60}
                        height={60}
                        className={classes.amenity_image}
                      />
                    </div>
                    <div className={classes.amenity_info}>
                      <span className={classes.amenity_name}>{amenity.name}</span>
                      {amenity.description && (
                        <span className={classes.amenity_description}>
                          {amenity.description}
                        </span>
                      )}
                    </div>
                    <button className={classes.add_icon}>
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
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
  );
};

