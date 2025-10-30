# StayWell

Проект состоит из трёх частей: бекенд, фронтенд и общего пакета с типами и базой данных. Общий пакет нужен для удобного использования и наследования как на бекенде, так и на фронтенде - он уменьшает количество кода, предотвращает дублирование и решает проблему несоответствия типов

## Архитектура проекта

Проект построен по монолитной архитектуре с разделением на три основные части:

- **Backend** (NestJS) - REST API + WebSocket сервер
- **Frontend** (Next.js) - веб-приложение для администраторов и пользователей
- **Shared** - общие типы данных, модели базы данных и утилиты

### Технологический стек

#### Backend
- **Framework**: NestJS (Node.js)
- **Язык**: TypeScript
- **База данных**: PostgreSQL
- **ORM**: Prisma  (извлекается из shared пакета)
- **Кэширование**: Redis
- **Аутентификация**: JWT
- **Валидация**: class-validator
- **Документация API**: Swagger
- **WebSocket**: Socket.IO для чата

#### Frontend
- **Framework**: Next.js 15 (App Router)
- **Язык**: TypeScript
- **UI**: React 19
- **Стилизация**: SCSS Modules
- **Состояние**: Zustand
- **Запросы**: TanStack Query (React Query)
- **Формы**: React Hook Form
- **Иконки**: Lucide React
- **Линтер**: Biome

#### Shared
- **ORM**: Prisma
- **Типы**: Генерируются по схеме базы данных + вручную прописаны расширенные типы для отношений между моделями
- **Сборка**: TypeScript Compiler

## 📊 Модель данных

### Основные сущности

#### 🏠 Апартаменты (Apartments)
- Типы: BUDGET, STANDARD, EXCLUSIVE, SUPERIOR, LUXURY
- Характеристики: номер, этаж, вместимость, удобства
- Изображения и описания
- Варианты бронирования с ценами

#### 👥 Пользователи (Users)
- Роли: USER, ADMIN, GUIDE
- Профили с аватарами и контактными данными
- Верификация email и телефона

#### 📅 Бронирования (Bookings)
- Статусы: PENDING, CONFIRMED, COMPLETED, CANCELLED
- Период проживания
- Дополнительные услуги
- Связанные транзакции

#### 💳 Транзакции (Transactions)
- Типы: DEPOSIT, PAYMENT, REFUND, FINE
- Статусы: PENDING, SUCCESS, CANCELLED, FAILED
- Методы оплаты: CASH, CARD, TRANSFER

#### 🎭 События (Events)
- Мероприятия с гидами
- Бронирование мест
- Связанные транзакции

#### 💬 Сообщения (Messages)
- Чат между пользователями и администраторами
- Поддержка редактирования и мягкого удаления
- Группировка по бронированиям

#### ⭐ Отзывы (Reviews)
- Рейтинги апартаментов и бронирований
- Комментарии пользователей

### ERD Схема базы данных

```mermaid
erDiagram
    %% Пользователи и аутентификация
    User {
        string id PK
        string email UK
        string password_hash
        string image
        string first_name
        string last_name
        string phone_number
        datetime date_of_birth
        boolean is_active
        boolean email_verified
        boolean phone_verified
        Role role
        datetime created
        datetime updated
    }

    %% Апартаменты
    Apartment {
        string id PK
        string image
        string name
        string description
        string rules
        int number UK
        int floor
        int rooms_count
        int max_capacity
        boolean is_available
        boolean is_smoking
        boolean is_pet_friendly
        float deposit
        ApartmentType type
        datetime created
        datetime updated
        boolean is_excluded
    }

    %% Справочники
    Amenity {
        string id PK
        string name UK
        string image
        string description
        datetime created
        datetime updated
        boolean is_excluded
    }

    BedType {
        string id PK
        string name UK
        string image
        datetime created
        datetime updated
        boolean is_excluded
    }

    AdditionalOption {
        string id PK
        string name UK
        string description
        string image
        float price
        datetime created
        datetime updated
        boolean is_excluded
    }

    %% Бронирования и резервирования
    Reservation {
        string id PK
        string user_id FK
        string apartment_id FK
        datetime start
        datetime end
        datetime created
        datetime updated
    }

    BookingVariant {
        string id PK
        string apartment_id FK
        float price
        int capacity
        boolean is_available
        datetime created
        datetime updated
        boolean is_excluded
    }

    Booking {
        string id PK
        string user_id FK
        string booking_variant_id FK
        string transaction_id FK
        string message
        BookingStatus status
        datetime start
        datetime end
        datetime created
        datetime updated
    }

    %% Финансы
    Transaction {
        string id PK
        float amount
        string user_id FK
        string description
        string card_details_id FK
        string transfer_details_id FK
        TransactionType transaction_type
        TransactionStatus transaction_status
        PaymentMethod payment_method
        datetime created
        datetime updated
    }

    CardDetail {
        string id PK
        string user_id FK
        string number UK
        int expiry_month
        int expiry_year
        string holder
        string token
        datetime created
        datetime updated
        boolean is_excluded
    }

    TransferDetail {
        string id PK
        string bank_name
        string account_number
        string swift
        string payer_name
        string user_id FK
        datetime created
        datetime updated
    }

    %% События и мероприятия
    Event {
        string id PK
        string name
        string image
        string description
        string guide_id FK
        float price
        int capacity
        datetime start
        datetime end
        datetime created
        datetime updated
        boolean is_excluded
    }

    BookingEvent {
        string id PK
        int number_of_people
        string booking_id FK
        string event_id FK
        string transaction_id FK
        datetime created
        datetime updated
        boolean is_excluded
    }

    %% Коммуникации
    Message {
        string id PK
        string sender_id FK
        string receiver_id
        string message
        boolean is_read
        string booking_id FK
        datetime edited
        string replace_to FK
        boolean is_excluded
        datetime created
        datetime updated
    }

    %% Отзывы
    Review {
        string id PK
        string user_id FK
        string apartment_id FK
        string booking_id FK
        int rating
        string comment
        datetime created
        datetime updated
        boolean is_excluded
    }

    %% Связи многие-ко-многим
    ApartmentAmenity {
        string id PK
        string amenity_id FK
        string apartment_id FK
        datetime created
        datetime updated
        boolean is_excluded
    }

    ApartmentBed {
        string id PK
        string apartment_id FK
        string bed_type_id FK
        int count
        datetime created
        datetime updated
        boolean is_excluded
    }

    ApartmentImage {
        string id PK
        string image
        string name
        string description
        string apartment_id FK
        datetime created
        datetime updated
        boolean is_excluded
    }

    BookingAdditionalOption {
        string id PK
        int amount
        string option_id FK
        string booking_id FK
        datetime created
        datetime updated
    }

    EventImage {
        string id PK
        string name
        string image
        string description
        string event_id FK
        datetime created
        datetime updated
        boolean is_excluded
    }

    %% Связи между сущностями
    User ||--o{ Reservation : "создает"
    User ||--o{ Booking : "бронирует"
    User ||--o{ Transaction : "платит"
    User ||--o{ CardDetail : "имеет"
    User ||--o{ TransferDetail : "использует"
    User ||--o{ Review : "пишет"
    User ||--o{ Message : "отправляет"
    User ||--o{ Event : "ведет_как_гид"

    Apartment ||--o{ ApartmentImage : "имеет"
    Apartment ||--o{ ApartmentBed : "содержит"
    Apartment ||--o{ ApartmentAmenity : "предоставляет"
    Apartment ||--o{ BookingVariant : "предлагает"
    Apartment ||--o{ Reservation : "резервируется"
    Apartment ||--o{ Review : "оценивается"

    Amenity ||--o{ ApartmentAmenity : "предоставляется"
    BedType ||--o{ ApartmentBed : "используется"
    AdditionalOption ||--o{ BookingAdditionalOption : "добавляется"

    BookingVariant ||--o{ Booking : "бронируется"
    Booking ||--|| Transaction : "оплачивается"
    Booking ||--o{ BookingEvent : "включает"
    Booking ||--o{ BookingAdditionalOption : "расширяется"
    Booking ||--o{ Review : "оценивается"
    Booking ||--o{ Message : "обсуждается"

    Event ||--o{ EventImage : "иллюстрируется"
    Event ||--o{ BookingEvent : "бронируется"
    BookingEvent ||--|| Transaction : "оплачивается"

    CardDetail ||--o{ Transaction : "используется"
    TransferDetail ||--o{ Transaction : "используется"

    Message ||--o{ Message : "заменяет"
```

## 🚀 Запуск проекта

### Предварительные требования
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- pnpm

### Установка зависимостей
```bash
# Установка всех зависимостей
pnpm install
```

### Настройка базы данных  // сейчас не нужно, для заметки
```bash
# Запуск контейнеров базы данных
docker-compose up -d

# Создание и применение миграций
cd shared
pnpm prisma migrate dev

# Заполнение начальными данными
pnpm db:seed
```

### Переменные окружения

Создайте файлы `.env` в корневых директориях backend и frontend:

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5433/staywell"
REDIS_URL="redis://localhost:6379"

JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"

FRONTEND_URL="http://localhost:3000"

# Email настройки (опционально)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""

# Stripe/Payment настройки (опционально)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"
```

### Запуск в режиме разработки
```bash
# Запуск всех сервисов параллельно (вывод с задержкой, не рекомендуется)
pnpm dev

# Или по отдельности:
# Backend
pnpm --filter backend dev

# Frontend (в новом терминале)
pnpm --filter frontend dev
```

### Продакшн сборка
```bash
# Сборка всех сервисов
pnpm build

# Запуск в продакшне
pnpm start
```

## 📁 Структура проекта

```
staywell/
├── backend/                    # NestJS API сервер
│   ├── src/
│   │   ├── app/
│   │   │   ├── apartments-section/    # Модуль апартаментов
│   │   │   │   ├── apartments/        # CRUD апартаментов
│   │   │   │   ├── amenities/         # Удобства
│   │   │   │   ├── bed-types/         # Типы кроватей
│   │   │   │   ├── reviews/           # Отзывы
│   │   │   │   └── module.ts          # Модуль секции
│   │   │   ├── bookings-section/      # Модуль бронирований
│   │   │   ├── events-section/        # Модуль событий
│   │   │   ├── transactions-section/  # Модуль транзакций
│   │   │   ├── users-section/         # Модуль пользователей
│   │   │   ├── app.module.ts          # Главный модуль
│   │   │   └── app.module.ts
│   │   └── lib/                       # Общие утилиты
│   │       ├── common/                # Декораторы, гварды, интерсепторы
│   │       ├── files/                 # Работа с файлами
│   │       ├── prisma/                # Prisma клиент
│   │       ├── redis/                 # Redis клиент
│   │       └── websocket/             # WebSocket адаптер
│   └── uploads/                       # Загруженные файлы
├── frontend/                  # Next.js приложение
│   ├── src/
│   │   ├── app/                       # App Router
│   │   │   ├── admin/                 # Админ панель
│   │   │   │   ├── apartments/        # Управление апартаментами
│   │   │   │   ├── bookings/          # Управление бронированиями
│   │   │   │   ├── events/            # Управление событиями
│   │   │   │   ├── users/             # Управление пользователями
│   │   │   │   ├── services/          # Управление услугами
│   │   │   │   └── layout.tsx         # Админ лейаут
│   │   │   ├── auth/                  # Аутентификация
│   │   │   │   ├── login/             # Вход
│   │   │   │   └── register/          # Регистрация
│   │   │   └── (app)/                 # Публичная часть
│   │   │       ├── apartment/[id]/    # Страница апартамента
│   │   │       └── page.tsx           # Главная страница
│   │   ├── components/                # Компоненты
│   │   │   ├── admin/                 # Админ компоненты
│   │   │   │   ├── common/            # Общие (AdminPage, Layout)
│   │   │   │   └── pages/             # Страничные компоненты
│   │   │   ├── common/                # Общие компоненты
│   │   │   └── public/                # Публичные компоненты
│   │   ├── hooks/                     # React хуки
│   │   │   ├── admin/                 # Админ хуки
│   │   │   ├── common/                # Общие хуки
│   │   │   └── public/                # Публичные хуки
│   │   ├── lib/                       # Утилиты и API
│   │   │   └── api/                   # API клиенты
│   │   └── stores/                    # Zustand stores
│   └── public/                        # Статические файлы
├── shared/                    # Общая библиотека
│   ├── prisma/                        # Схема БД и миграции
│   ├── src/
│   │   ├── common/                    # Общие типы
│   │   ├── database/                  # Prisma клиент
│   │   ├── models/                    # Модели данных
│   │   └── types/                     # Сгенерированные типы
│   └── seeds/                         # Начальные данные
└── nginx.conf                 # Nginx конфигурация
```

## 🔧 Backend API

### Архитектура модулей

Каждый функциональный модуль следует паттерну:
```
module/
├── controller.ts           # HTTP контроллер
├── services/               # Бизнес логика
│   ├── crud.service.ts     # Основные CRUD операции
│   ├── list.service.ts     # Операции списка с фильтрами
│   └── *.service.ts        # Специфичные сервисы
├── dto/                    # Data Transfer Objects
│   ├── create.dto.ts       # DTO создания
│   ├── update.dto.ts       # DTO обновления
│   ├── filters.dto.ts      # DTO фильтров
│   └── index.ts            # Экспорты
└── module.ts               # NestJS модуль
```

## 🎨 Frontend компоненты

### Архитектура компонентов

Компоненты организованы по принципу атомарного дизайна:

#### Admin компоненты
- **common/** - Общие компоненты (AdminPage, Layout, Form)
- **pages/** - Страничные компоненты с бизнес логикой

#### Структура страничного компонента
```
PageComponent/
├── PageComponent.tsx        # Основной компонент
├── PageComponent.module.scss # Стили
├── index.ts                 # Экспорт
└── components/              # Вложенные компоненты
    ├── SubComponent/
    │   ├── SubComponent.tsx
    │   ├── SubComponent.module.scss
    │   └── index.ts
    └── index.ts
```

### UI паттерны

#### AdminPage
Обертка для всех админ страниц с заголовком и навигацией.

#### BaseFormModal
Универсальный модал для форм с react-hook-form интеграцией.

#### Shimmer
Компонент загрузки с анимацией скелета.

#### ListPage
Универсальный компонент списка с фильтрами, пагинацией и действиями.

## 📱 Адаптивный дизайн

### SCSS архитектура - /frontend/src/components/styles/

- **Variables**: _variables.scss Глобальные переменные цветов, шрифтов, отступов
- **Mixins**: _mixins.scss Переиспользуемые стили
- **Modules**: Компонентные стили

### Backend тесты
```bash
pnpm --filter backend lint
```

### Frontend тесты
```bash
pnpm --filter frontend lint
```