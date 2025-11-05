'use client'

import { example_user, Role } from '@shared/src';

import { ListPage } from '@/components/admin/common/AdminPage';
import { UserRow, UserRowShimmer } from './components';


export const Users = () => (
  <ListPage
    model="USER"
    filters_config={{
      role: { 
        type: 'enum', 
        options: Object.values(Role),
        placeholder: 'All Roles'
      },
      email_verified: { 
        type: 'boolean',
        label: 'Email Verified'
      },
      phone_verified: { 
        type: 'boolean',
        label: 'Phone Verified'
      },
      is_active: { 
        type: 'boolean',
        label: 'Active'
      },
      email: { 
        type: 'string',
        placeholder: 'Search by email...'
      },
      phone_number: { 
        type: 'string',
        label: 'Phone Number',
        placeholder: 'Search by phone...'
      },
    }}
    render_item={(user) => <UserRow key={user.id} user={user} />}
    shimmer_item={(key) => <UserRowShimmer key={key} />}
    columns={[
      { label: 'Name', field: 'first_name' },
      { label: 'Role', field: 'role' },
      { label: 'Created', field: 'created' }
    ]}
    sort_by_list={Object.keys(example_user).filter((key) => !['image'].includes(key)).sort()}
  />
)