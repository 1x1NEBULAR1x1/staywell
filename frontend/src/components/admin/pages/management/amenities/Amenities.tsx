'use client'

import { Amenity, example_amenity } from '@shared/src';

import { AmenityCard, AmenityCardShimmer, FiltersMenu } from './components';
import { ListPage, CreateButton } from '@/components/admin/common/AdminPage';
import { useState } from 'react';
import { AmenityModal } from '@/components/admin/common/Modal/AmenityModal';

export const Amenities = () => {
  const [modal_data, setModalData] = useState<{ is_modal_open: boolean, amenity: Amenity | undefined }>({ is_modal_open: false, amenity: undefined })
  return (
    <>
      <ListPage
        create_button={<CreateButton label="Add Amenity" onClick={() => setModalData({ is_modal_open: true, amenity: undefined })} />}
        filters_menu={<FiltersMenu />}
        model="AMENITY"
        render_item={(amenity) => <AmenityCard key={amenity.id} amenity={amenity} setEditAmenityData={(amenity) => setModalData({ is_modal_open: true, amenity })} />}
        shimmer_item={(key) => <AmenityCardShimmer key={key} />}
        columns={['Name', 'Created']}
        sort_by_list={Object.keys(example_amenity).filter((key) => !['image', 'description', 'is_excluded', 'apartment_amenities'].includes(key)).sort()}
      />
      {modal_data.is_modal_open && (
        <AmenityModal
          initial_data={modal_data.amenity}
          onClose={() => setModalData({ is_modal_open: false, amenity: undefined })}
        />
      )}
    </>
  )
}
