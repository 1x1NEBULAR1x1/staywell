import { ColumnConfig, FiltersConfig } from "@/components/admin/common/AdminPage/ListPage";
import { Event } from "@shared/src/database";

export const columns: ColumnConfig<keyof Event>[] = [
  { label: 'Name', field: 'name' },
  { label: 'Status', field: 'is_excluded' },
  { label: 'Capacity', field: 'capacity' },
  { label: 'Created', field: 'created' }
]

export const filters_config: FiltersConfig = {
  name: {
    type: 'string',
    placeholder: 'Search by name...'
  },
  min_capacity: {
    type: 'integer',
    label: 'Min Capacity',
    placeholder: 'Minimum capacity...'
  },
  max_capacity: {
    type: 'integer',
    label: 'Max Capacity',
    placeholder: 'Maximum capacity...'
  },
  min_price: {
    type: 'number',
    label: 'Min Price',
    placeholder: 'Minimum price...'
  },
  max_price: {
    type: 'number',
    label: 'Max Price',
    placeholder: 'Maximum price...'
  },
  min_start: {
    type: 'date',
    label: 'Start Date From'
  },
  max_start: {
    type: 'date',
    label: 'Start Date To'
  },
  min_end: {
    type: 'date',
    label: 'End Date From'
  },
  max_end: {
    type: 'date',
    label: 'End Date To'
  },
}