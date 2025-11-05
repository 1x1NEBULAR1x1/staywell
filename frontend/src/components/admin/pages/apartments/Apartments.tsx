'use client'

import { example_apartment } from '@shared/src';
import { ApartmentCard, ApartmentCardShimmer } from './components';
import { ListPage } from '@/components/admin/common/AdminPage';
import { columns, filters_config } from './config';
import { ApartmentModal } from './ApartmentModal';


export const Apartments = () => (
  <ListPage
    model="APARTMENT"
    create_modal={<ApartmentModal />}
    filters_config={filters_config}
    render_item={(apartment) => <ApartmentCard key={apartment.id} apartment={apartment} />}
    shimmer_item={(key) => <ApartmentCardShimmer key={key} />}
    columns={columns}
    sort_by_list={Object.keys(example_apartment).filter((key) => !['image', 'rules'].includes(key)).sort()}
  />
)