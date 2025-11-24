# Event Page Structure

## Overview
Страница события создана по аналогии со страницей апартаментов с использованием сайдбара и системы табов.

## Structure

```
[id]/
├── Event.tsx                 # Главный компонент страницы
├── Event.module.scss        # Стили страницы
├── index.ts                 # Экспорт компонента
├── components/
│   ├── EventSidebar/        # Боковая панель с информацией и навигацией
│   │   ├── EventSidebar.tsx
│   │   ├── EventSidebar.module.scss
│   │   └── index.ts
│   ├── GeneralTab/          # Основная информация о событии
│   │   ├── GeneralTab.tsx
│   │   ├── GeneralTab.module.scss
│   │   ├── index.ts
│   │   └── components/
│   │       └── index.ts     # Реэкспорт MainData, MetaData, EditEventModal
│   ├── GalleryTab/          # Галерея изображений события
│   │   ├── GalleryTab.tsx
│   │   ├── GalleryTab.module.scss
│   │   ├── index.ts
│   │   └── components/
│   │       └── index.ts     # Реэкспорт Gallery
│   ├── BookingsTab/         # Бронирования события
│   │   ├── BookingsTab.tsx
│   │   ├── BookingsTab.module.scss
│   │   └── index.ts
│   ├── EventData/           # Legacy компонент (сохранён для совместимости)
│   └── index.ts             # Главный экспорт всех компонентов
```

## Components

### Event.tsx
Главный компонент страницы, управляет:
- Состоянием активного таба
- Рендерингом соответствующего контента
- Общим лейаутом страницы

### EventSidebar
Боковая панель с:
- Главным изображением события
- Статусом события (Upcoming/Active/Completed)
- Основной информацией (capacity, price, bookings, images)
- Информацией о гиде (если есть)
- Навигацией по табам

### GeneralTab
Общая информация о событии:
- Расписание (даты начала/конца, длительность)
- Описание события
- Информация о гиде
- Статистика вместимости и цен

### GalleryTab
Управление изображениями:
- Галерея всех изображений события
- Статистика изображений (Total/Active/Excluded)
- Советы по фотографиям
- Функционал добавления/удаления изображений

### BookingsTab
Информация о бронированиях:
- Сводная статистика (bookings, participants, revenue)
- Прогресс заполнения мест
- Список бронирований (placeholder для будущей реализации)
- Информация о ценах

## Data Model

Компонент использует тип `ExtendedEvent` из `@shared/src/types`:

```typescript
interface ExtendedEvent extends Event {
  guide?: UserWithoutPassword;
  images: EventImage[];
}
```

Базовая модель Event из Prisma:
- id, name, description
- image, price, capacity
- start, end (DateTime)
- guide_id
- created, updated, is_excluded

## Usage

```typescript
import { Event } from '@/components/admin/pages/events/[id]';

export default function EventPage() {
  return <Event />;
}
```

## Notes

1. Компонент использует `usePId()` hook для получения ID из URL
2. Использует `useModel('EVENT')` для работы с данными
3. Все стили используют SCSS переменные из `@/components/styles/_variables.scss`
4. Следует принципам SOLID и структуре проекта
5. BookingsTab содержит placeholder для будущей реализации списка бронирований

