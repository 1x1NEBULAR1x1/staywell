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
$primary-main          // instead of $primary-main
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

## Chat Components Pattern

### Component Structure for Chat Features

Для создания чат-компонентов с real-time обновлениями используйте следующую структуру:

```
ChatSidebar/
├── ChatSidebar.tsx              # Main component with logic
├── ChatSidebar.module.scss      # Main styles
├── index.ts
└── components/
    ├── ChatSidebarHeader/       # Header with search
    │   ├── ChatSidebarHeader.tsx
    │   ├── ChatSidebarHeader.module.scss
    │   └── index.ts
    ├── ChatUserList/            # List of users
    │   ├── ChatUserList.tsx
    │   ├── ChatUserList.module.scss
    │   └── index.ts
    ├── ChatUserItem/            # Single user item
    │   ├── ChatUserItem.tsx
    │   ├── ChatUserItem.module.scss
    │   └── index.ts
    └── index.ts

ChatWindow/
├── ChatWindow.tsx               # Main component with logic
├── ChatWindow.module.scss       # Main styles (только контейнер)
├── index.ts
└── components/
    ├── ChatWindowHeader/        # Header with user info
    │   ├── ChatWindowHeader.tsx
    │   ├── ChatWindowHeader.module.scss
    │   └── index.ts
    ├── ChatMessages/            # Messages container with scroll logic
    │   ├── ChatMessages.tsx
    │   ├── ChatMessages.module.scss
    │   └── index.ts
    ├── MessageBubble/           # Single message bubble
    │   ├── MessageBubble.tsx
    │   ├── MessageBubble.module.scss
    │   └── index.ts
    ├── ChatInput/               # Input field with send button
    │   ├── ChatInput.tsx
    │   ├── ChatInput.module.scss
    │   └── index.ts
    └── index.ts
```

### Using Polling for Real-time Updates

```tsx
// Hook with polling для списка последних сообщений
const getLastMessages = (options?: { refetchInterval?: number }) =>
  useQuery({
    queryKey: ['messages', 'last'],
    queryFn: async () => {
      const result = await messages_api.get({
        take: 100,
        skip: 0,
        sort_field: 'created',
        sort_direction: 'desc',
      });
      return result.data;
    },
    refetchInterval: options?.refetchInterval || 5000, // Polling every 5 seconds
    select: (data) => data,
  });

// Hook с infinite scroll и polling для окна чата
const getInfinite = (
  chat_partner_id: string,
  options?: { enabled?: boolean; refetchInterval?: number }
) => {
  const take = 30;

  const query = useInfiniteQuery({
    queryKey: ['messages', 'infinite', { chat_partner_id }],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await messages_api.get({
        chat_partner_id,
        skip: pageParam * take,
        take,
        sort_field: 'created',
        sort_direction: 'desc', // Новые сообщения сначала в запросе
      });
      return result.data;
    },
    getNextPageParam: (lastPage, pages) => {
      const hasMore = lastPage.items.length === take;
      return hasMore ? pages.length : undefined;
    },
    initialPageParam: 0,
    enabled: options?.enabled !== false && !!chat_partner_id,
    refetchInterval: options?.refetchInterval || 5000, // Polling каждые 5 секунд
  });

  // Разворачиваем массив: API возвращает новые сначала,
  // UI должен показывать старые сверху, новые снизу
  const messages = useMemo(() => {
    const all_messages = query.data?.pages.flatMap(page => page.items) || [];
    return all_messages.reverse();
  }, [query.data]);
};
```

### Auto-scroll для новых сообщений с правильной обработкой загрузки истории

При реализации чата с infinite scroll важно правильно обрабатывать скролл в двух сценариях:
1. Новые сообщения внизу - автоматически скроллить вниз
2. Загрузка истории вверху - сохранять позицию пользователя

```tsx
// Refs для отслеживания состояния скролла
const messages_container_ref = useRef<HTMLDivElement>(null);
const previous_scroll_height_ref = useRef<number>(0);
const previous_messages_count_ref = useRef<number>(0);

useEffect(() => {
  if (!messages_container_ref.current) return;

  const container = messages_container_ref.current;
  const is_at_bottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

  // Определяем, загрузили ли мы старые сообщения вверху
  const messages_count_increased = messages.length > previous_messages_count_ref.current;
  const loaded_previous_messages = messages_count_increased && previous_messages_count_ref.current > 0;

  if (loaded_previous_messages) {
    // При загрузке старых сообщений - сохраняем позицию относительно нижних сообщений
    const new_scroll_height = container.scrollHeight;
    const scroll_height_diff = new_scroll_height - previous_scroll_height_ref.current;
    
    if (scroll_height_diff > 0) {
      // Компенсируем добавление новых сообщений вверху
      container.scrollTop = container.scrollTop + scroll_height_diff;
    }
  } else if (should_scroll || is_at_bottom) {
    // При новых сообщениях внизу или первой загрузке - скроллим в конец
    container.scrollTop = container.scrollHeight;
    if (should_scroll) {
      onScrollComplete();
    }
  }

  // Сохраняем текущее состояние для следующего рендера
  previous_messages_count_ref.current = messages.length;
  previous_scroll_height_ref.current = container.scrollHeight;
}, [messages, should_scroll, onScrollComplete]);

// Обработчик скролла для загрузки истории
const handleScroll = () => {
  if (!messages_container_ref.current) return;
  const { scrollTop } = messages_container_ref.current;

  // Если проскроллили до верха - загружаем больше сообщений
  if (scrollTop === 0 && has_next_page && !is_fetching_next_page) {
    // Сохраняем текущую высоту перед загрузкой
    previous_scroll_height_ref.current = messages_container_ref.current.scrollHeight;
    onLoadMore();
  }
};
```

### Grouping Messages by Users

```tsx
// Группируем сообщения по пользователям
const users_with_last_messages = useMemo<UserWithLastMessage[]>(() => {
  if (!users_data?.items || !current_user) return [];

  const messages = messages_data?.items || [];

  return users_data.items.map((user: UserWithoutPassword) => {
    // Находим все сообщения между current_user и этим user
    const user_messages = messages.filter(
      (msg: Message) =>
        (msg.sender_id === user.id && msg.receiver_id === current_user.id) ||
        (msg.sender_id === current_user.id && msg.receiver_id === user.id)
    );

    // Сортируем по дате создания (новые первыми)
    user_messages.sort((a, b) => 
      new Date(b.created).getTime() - new Date(a.created).getTime()
    );

    const last_message = user_messages[0];

    // Считаем непрочитанные сообщения
    const unread_count = user_messages.filter(
      (msg: Message) => 
        msg.sender_id === user.id && 
        msg.receiver_id === current_user.id && 
        !msg.is_read
    ).length;

    return {
      ...user,
      last_message,
      unread_count,
    };
  });
}, [users_data?.items, messages_data?.items, current_user]);
```

### Time Formatting for Messages

```tsx
const formatMessageTime = (date: Date | string) => {
  const message_date = new Date(date);
  const now = new Date();
  const diff = now.getTime() - message_date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  
  return message_date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
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
9. **Real-time Updates**: Use polling with refetchInterval for real-time data