'use client'

import { example_apartment } from '@shared/src';

import { ApartmentCard, ApartmentCardShimmer, FiltersMenu } from './components';
import { ListPage } from '@/components/admin/common/AdminPage';


export const Apartments = () => (
  <ListPage
    model="APARTMENT"
    filters_menu={<FiltersMenu />}
    render_item={(apartment) => <ApartmentCard key={apartment.id} apartment={apartment} />}
    shimmer_item={(key) => <ApartmentCardShimmer key={key} />}
    columns={['Name', 'Status', 'Type', 'Created']}
    sort_by_list={Object.keys(example_apartment).filter((key) => !['image', 'rules'].includes(key)).sort()}
  />
)