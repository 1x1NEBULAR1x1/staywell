'use client'

import { AdditionalOption, example_additional_option } from '@shared/src';

import { AdditionalOptionCard, AdditionalOptionCardShimmer, FiltersMenu } from './components';
import { ListPage, CreateButton } from '@/components/admin/common/AdminPage';
import { useState } from 'react';
import { AdditionalOptionModal } from '@/components/admin/common/Modal/models/AdditionalOptionModal';

export const AdditionalOptions = () => {
  const [modal_data, setModalData] = useState<{ is_modal_open: boolean, additional_option: AdditionalOption | undefined }>({ is_modal_open: false, additional_option: undefined })
  return (
    <>
      <ListPage
        create_button={<CreateButton label="Add Additional Option" onClick={() => setModalData({ is_modal_open: true, additional_option: undefined })} />}
        model="ADDITIONAL_OPTION"
        render_item={(additional_option) => <AdditionalOptionCard key={additional_option.id} additional_option={additional_option} setEditAdditionalOptionData={(additional_option) => setModalData({ is_modal_open: true, additional_option })} />}
        shimmer_item={(key) => <AdditionalOptionCardShimmer key={key} />}
        columns={[
          { label: 'Name', field: 'name' },
          { label: 'Price', field: 'price' },
          { label: 'Created', field: 'created' }
        ]}
        sort_by_list={Object.keys(example_additional_option).filter((key) => !['image', 'is_excluded', 'booking_additional_options'].includes(key)).sort()}
      />
      {modal_data.is_modal_open && (
        <AdditionalOptionModal
          initial_data={modal_data.additional_option}
          onClose={() => setModalData({ is_modal_open: false, additional_option: undefined })}
        />
      )}
    </>
  )
}
