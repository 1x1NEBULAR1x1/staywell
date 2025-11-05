import { Apartment, ApartmentType } from "@shared/src/database";
import { ColumnConfig, FiltersConfig } from "@/components/admin/common/AdminPage/ListPage";

export const columns: ColumnConfig<keyof Apartment>[] = [
  { label: 'Name', field: 'name' },
  { label: 'Status', field: 'is_available' },
  { label: 'Type', field: 'type' },
  { label: 'Created', field: 'created' }
]

export const filters_config: FiltersConfig = {
  type: {
    type: 'enum',
    options: Object.values(ApartmentType),
    placeholder: 'All Types'
  },
  is_available: {
    type: 'boolean',
    label: 'Available'
  },
  is_smoking: {
    type: 'boolean',
    label: 'Smoking Allowed'
  },
  is_pet_friendly: {
    type: 'boolean',
    label: 'Pet Friendly'
  },
  name: {
    type: 'string',
    placeholder: 'Search by name...'
  },
  number: {
    type: 'string',
    placeholder: 'Room number...'
  },
  floor: {
    type: 'integer',
    placeholder: 'Floor...'
  },
  rooms_count: {
    type: 'integer',
    label: 'Rooms Count',
    placeholder: 'Number of rooms...'
  },
  max_capacity: {
    type: 'integer',
    label: 'Max Capacity',
    placeholder: 'Max guests...'
  },
  deposit: {
    type: 'number',
    placeholder: 'Deposit amount...'
  },
}