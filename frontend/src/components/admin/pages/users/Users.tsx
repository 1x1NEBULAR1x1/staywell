'use client'

import { example_user } from '@shared/src';

import { ListPage } from '@/components/admin/common/AdminPage';
import { UserRow, UserRowShimmer, FiltersMenu } from './components';


export const Users = () => (
  <ListPage
    model="USER"
    filters_menu={<FiltersMenu />}
    render_item={(user) => <UserRow key={user.id} user={user} />}
    shimmer_item={(key) => <UserRowShimmer key={key} />}
    columns={['Name', 'Role', 'Created']}
    sort_by_list={Object.keys(example_user).filter((key) => !['image'].includes(key)).sort()}
  />
)