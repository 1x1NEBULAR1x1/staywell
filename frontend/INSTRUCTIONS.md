# Frontend Component Instructions

## Shimmer Component

Component `Shimmer` is designed to create a shimmer effect when loading content. It doesn't set any sizes or shapes, only adds animation.

### Basic Usage

```tsx
import { Shimmer } from '@/components/styles/ui';

// Avatar with shimmer animation
<Shimmer style={{
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#f0f0f0'
}}>
  <div />
</Shimmer>

// Text with animation
<Shimmer style={{
  height: '16px',
  borderRadius: '4px',
  backgroundColor: '#e0e0e0',
  width: '200px'
}}>
  <div />
</Shimmer>

// Via CSS classes
<Shimmer className="my-loading-avatar">
  <div />
</Shimmer>
```

### Props

- `show_animation?: boolean` - enable/disable animation (default `true`)
- `className?: string` - additional CSS classes
- `children?: ReactNode` - component content
- `...props` - all other HTML attributes for div

### Features

1. **Style Inheritance**: Component inherits `border-radius` from parent styles via `border-radius: inherit`
2. **Flexibility**: All sizes, colors and shapes are set via `style` or `className`
3. **Animation**: Gradient wave passes from left to right with smooth appearance/disappearance

## BookingCard Component

Component `BookingCard` is designed to display booking information as a card in flex/grid containers.

### Card Structure

```tsx
<Link href={`/admin/bookings/${booking.id}`}>
  <div className={classes.booking_card}>
    <div className={classes.booking_card_header}>
      <div className={classes.booking_card_price}>$31 per night</div>
      <div className={classes.booking_card_actions}>
        <EditIcon />
        <TrashIcon />
      </div>
    </div>

    <Image className={classes.booking_card_image} />

    <div className={classes.booking_card_content}>
      <h3 className={classes.booking_card_title}>Apartment Name</h3>

      <div className={classes.booking_card_dates}>
        Booking dates
        <span className={classes.booking_card_nights}>Number of days</span>
      </div>

      <div className={classes.booking_card_details}>
        <div className={classes.booking_card_apartment_info}>
          Apartment information
        </div>

        <div className={classes.booking_card_user_info}>
          <Image className={classes.booking_card_user_avatar} />
          <div className={classes.booking_card_user_details}>
            User information
          </div>
        </div>
      </div>

      <div className={classes.booking_card_payment}>
        Payment information
      </div>

      <div className={classes.booking_card_status}>
        <span className={classes.booking_card_status_badge}>Status</span>
      </div>
    </div>
  </div>
</Link>
```

### Key Features

1. **Responsive Design**: Card adapts to different screen sizes
2. **Separators**: Lines between main sections added
3. **Compact Size**: All text reduced for better perception
4. **Color Scheme**: Uses variables from `_variables.scss`
5. **Interactivity**: Hover effects and action buttons

## Detail Page Patterns

### Component Structure for Detail Pages

For creating detail pages (apartments/[id], bookings/[id], users/[id]) use the following structure:

```
pages/[entity]/[id]/
├── Entity.tsx                    # Main page component
├── index.ts                     # Main component export
└── components/
    ├── EntityData/              # Main data component
    │   ├── EntityData.tsx
    │   ├── EntityData.module.scss
    │   ├── index.ts
    │   └── components/          # Sub-components
    │       ├── MainData/        # Main info + edit button
    │       ├── MetaData/        # Metadata (statuses, dates, prices)
    │       ├── RelatedEntity1/  # Related entities with navigation
    │       ├── RelatedEntity2/
    │       ├── FeatureSection/  # Entity-specific sections
    │       ├── EditModal/       # Edit modal
    │       └── index.ts
    └── index.ts
```

### Main Page Component

```tsx
// Entity.tsx
'use client';
import { AdminPage } from '@/components/admin/common/AdminPage';
import { EntityData } from './components';
import { useModel } from '@/hooks/admin/queries/useModel';
import { ExtendedEntity } from '@shared/src';

export const Entity = ({ id, initial_data }: { 
  id: string, 
  initial_data?: ExtendedEntity 
}) => {
  const { data: entity, refetch } = useModel('ENTITY').find(id, { 
    initial_data: initial_data ? { data: initial_data } : undefined 
  });
  
  if (!entity) return null;
  
  return (
    <AdminPage title='Entity Name'>
      <EntityData entity={entity} refetch={refetch} />
    </AdminPage>
  );
};
```

### Main Data Component

```tsx
// EntityData.tsx
import classes from './EntityData.module.scss';
import { useState } from 'react';
import { ExtendedEntity } from '@shared/src';
import { 
  MainData, 
  MetaData, 
  RelatedEntity1,
  RelatedEntity2,
  FeatureSection,
  EditModal 
} from './components';

export const EntityData = ({ entity, refetch }: { 
  entity: ExtendedEntity, 
  refetch: () => void 
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className={classes.header}>
        <div className={classes.main_info}>
          <div className={classes.info}>
            <MainData entity={entity} setIsEditModalOpen={setIsEditModalOpen} />
            <MetaData entity={entity} />
            
            <div className={classes.connections}>
              <RelatedEntity1 relatedData={entity.relatedData1} />
              <RelatedEntity2 relatedData={entity.relatedData2} />
            </div>

            <div className={classes.features}>
              <FeatureSection entity={entity} refetch={refetch} />
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditModal
          entity={entity}
          onClose={() => setIsEditModalOpen(false)}
          refetch={refetch}
        />
      )}
    </>
  );
};
```

### MainData Component (Title + Edit Button)

```tsx
export const MainData = ({ entity, setIsEditModalOpen }: {
  entity: ExtendedEntity,
  setIsEditModalOpen: (open: boolean) => void
}) => (
  <>
    <h1 className={classes.title_container}>
      <div className={classes.title_info}>
        <span className={classes.title}>Entity Name</span>
        <span className={classes.status}>Status</span>
      </div>
      <button
        className={classes.edit_btn}
        onClick={() => setIsEditModalOpen(true)}
      >
        Edit
      </button>
    </h1>
    <div className={classes.subtitle}>Additional information</div>
  </>
);
```

## Required SCSS Variables

**Always use global variables from `_variables.scss`:**

```scss
@use '@/components/styles/_variables.scss' as *;

// Colors
$primary-main          // instead of $primary-color
$foreground-main       // instead of $foreground-primary  
$foreground-secondary  // gray text
$foreground-light      // instead of $foreground-tertiary
$background-main       // white background
$background-light      // instead of $background-secondary
$green, $red, $yellow  // instead of $success-color, $error-color, $warning-color

// Borders and spacing
$border-normal         // instead of 1px solid $border-color
$border-radius-md      // instead of $border-radius
$border-radius-sm      // for small elements
$spacing-*             // all spacing values

// Fonts
$font-weight-bold      // instead of 700
$font-weight-semibold  // instead of 600  
$font-weight-normal    // instead of 500
$font-size-*           // all font sizes

// Transitions
$transition-fast       // instead of 0.2s ease
$transition-normal     // instead of 0.3s ease
```

## Related Entity Components

For displaying related entities with navigation:

```tsx
export const RelatedEntityInfo = ({ relatedEntity }: { relatedEntity: Entity }) => (
  <div className={classes.entity_info}>
    <div className={classes.header}>
      <EntityIcon className={classes.header_icon} />
      <h3 className={classes.title}>Entity Information</h3>
      <Link href={`/admin/entities/${relatedEntity.id}`} className={classes.link_button}>
        <ExternalLink className={classes.link_icon} />
        View
      </Link>
    </div>
    <div className={classes.content}>
      {/* Content */}
    </div>
  </div>
);
```

## Modal Components

### Using BaseFormModal

```tsx
export const EditEntityModal = ({ entity, onClose, refetch }: {
  entity: ExtendedEntity,
  onClose: () => void,
  refetch: () => void
}) => {
  const update_mutation = useModel('ENTITY').update(entity.id);
  const toast = useToast();
  
  const form = useForm<FormData>({
    defaultValues: { ...entity }
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await update_mutation.mutateAsync(data);
      refetch();
      onClose();
      toast.success('Updated successfully');
    } catch (error) {
      isAxiosError(error) && toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title="Edit Entity"
      form={form}
      onSubmit={handleSubmit}
      model="ENTITY"
      id={entity.id}
      is_loading={update_mutation.isPending}
    >
      {/* Form fields */}
    </BaseFormModal>
  );
};
```

## Management Page Pattern

For entity management pages (services, bed-types, amenities):

```tsx
export const EntityManager = () => {
  const { data: items, refetch } = useModel('ENTITY').get({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Entity | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    
    try {
      await fetch(`/api/entities/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      refetch();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header with add button */}
      {/* Grid of items */}
      {/* Modals */}
    </div>
  );
};
```

## General Principles

1. **Component Decomposition**: Break complex components into smaller ones
2. **Reusability**: Create common patterns for similar components  
3. **SCSS Variables**: Always use global variables
4. **TypeScript**: Strict typing through shared types
5. **Accessibility**: Use semantic tags and ARIA attributes
6. **Responsiveness**: Adaptive styles for all screens
7. **Error Handling**: Proper error states and user feedback
8. **Loading States**: Show loading indicators for async operations