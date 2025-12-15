# StayWell

Projekt składa się z trzech części: backendu, frontendu i wspólnego pakietu z typami i bazą danych. Wspólny pakiet jest potrzebny do wygodnego użytkowania i dziedziczenia zarówno w backendzie, jak i frontendzie - zmniejsza ilość kodu, zapobiega duplikowaniu i rozwiązuje problem niezgodności typów

## Architektura projektu

Projekt zbudowany jest w oparciu o architekturę monolityczną z podziałem na trzy główne części:

- **Backend** (NestJS) - serwer REST API + WebSocket
- **Frontend** (Next.js) - aplikacja webowa dla administratorów i użytkowników
- **Shared** - wspólne typy danych, modele bazy danych i narzędzia

### Stos technologiczny

#### Backend
- **Framework**: NestJS (Node.js)
- **Język**: TypeScript
- **Baza danych**: PostgreSQL
- **ORM**: Prisma (importowany z pakietu shared)
- **Cachowanie**: Redis
- **Uwierzytelnianie**: JWT
- **Walidacja**: class-validator
- **Dokumentacja API**: Swagger
- **WebSocket**: Socket.IO dla czatu

#### Frontend
- **Framework**: Next.js 15 (App Router)
- **Język**: TypeScript
- **UI**: React 19
- **Stylowanie**: SCSS Modules
- **Stan**: Zustand
- **Zapytania**: TanStack Query (React Query)
- **Formularze**: React Hook Form
- **Ikony**: Lucide React
- **Linter**: Biome

#### Shared
- **ORM**: Prisma
- **Typy**: Generowane na podstawie schematu bazy danych + ręcznie dodane rozszerzone typy dla relacji między modelami
- **Budowanie**: TypeScript Compiler

## Model danych

### Główne encje

#### Apartamenty (Apartments)
- Typy: BUDGET, STANDARD, EXCLUSIVE, SUPERIOR, LUXURY
- Charakterystyki: numer, piętro, pojemność, udogodnienia
- Zdjęcia i opisy
- Warianty rezerwacji z cenami

#### Użytkownicy (Users)
- Role: USER, ADMIN, GUIDE
- Profile z awatarami i danymi kontaktowymi
- Weryfikacja email i telefonu

#### Rezerwacje (Bookings)
- Statusy: PENDING, CONFIRMED, COMPLETED, CANCELLED
- Okres pobytu
- Dodatkowe usługi
- Powiązane transakcje

#### Transakcje (Transactions)
- Typy: DEPOSIT, PAYMENT, REFUND, FINE
- Statusy: PENDING, SUCCESS, CANCELLED, FAILED
- Metody płatności: CASH, CARD, TRANSFER

#### Wydarzenia (Events)
- Wydarzenia z przewodnikami
- Rezerwacja miejsc
- Powiązane transakcje

#### Wiadomości (Messages)
- Czat między użytkownikami a administratorami
- Wsparcie dla edycji i soft delete
- Grupowanie według rezerwacji

#### Recenzje (Reviews)
- Oceny apartamentów i rezerwacji
- Komentarze użytkowników

### Schemat ERD bazy danych

```mermaid
erDiagram
    %% Users and authentication
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

    %% Apartments
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

    %% Dictionaries
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

    %% Bookings and reservations
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

    %% Finance
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

    %% Events
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

    %% Communications
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

    %% Reviews
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

    %% Many-to-many relations
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

    %% Relations between entities
    User ||--o{ Reservation : "creates"
    User ||--o{ Booking : "books"
    User ||--o{ Transaction : "pays"
    User ||--o{ CardDetail : "has"
    User ||--o{ TransferDetail : "uses"
    User ||--o{ Review : "writes"
    User ||--o{ Message : "sends"
    User ||--o{ Event : "guides"

    Apartment ||--o{ ApartmentImage : "has"
    Apartment ||--o{ ApartmentBed : "contains"
    Apartment ||--o{ ApartmentAmenity : "provides"
    Apartment ||--o{ BookingVariant : "offers"
    Apartment ||--o{ Reservation : "is_reserved"
    Apartment ||--o{ Review : "is_reviewed"

    Amenity ||--o{ ApartmentAmenity : "is_provided"
    BedType ||--o{ ApartmentBed : "is_used"
    AdditionalOption ||--o{ BookingAdditionalOption : "is_added"

    BookingVariant ||--o{ Booking : "is_booked"
    Booking ||--|| Transaction : "is_paid"
    Booking ||--o{ BookingEvent : "includes"
    Booking ||--o{ BookingAdditionalOption : "is_extended"
    Booking ||--o{ Review : "is_reviewed"
    Booking ||--o{ Message : "is_discussed"

    Event ||--o{ EventImage : "is_illustrated"
    Event ||--o{ BookingEvent : "is_booked"
    BookingEvent ||--|| Transaction : "is_paid"

    CardDetail ||--o{ Transaction : "is_used"
    TransferDetail ||--o{ Transaction : "is_used"

    Message ||--o{ Message : "replaces"
```

## 🚀 Uruchomienie projektu

### Wymagania wstępne
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- pnpm

### Instalacja zależności
```bash
# Instalacja wszystkich zależności
pnpm install
```

### Konfiguracja bazy danych
```bash
# Tworzenie i aplikacja migracji
cd shared
pnpm prisma migrate dev

# Wypełnienie danymi początkowymi
pnpm db:seed
```

### Zmienne środowiskowe

Utwórz pliki `.env` w katalogach głównych backend i frontend:

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5433/staywell"
REDIS_URL="redis://localhost:6379"

JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"

FRONTEND_URL="http://localhost:3000"

# Ustawienia Email (opcjonalne)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""

# Ustawienia Stripe/Payment (opcjonalne)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"
```

### Uruchomienie w trybie deweloperskim
```bash
# Uruchomienie wszystkich serwisów równolegle (wyjście z opóźnieniem, niezalecane)
pnpm dev

# Lub osobno:
# Backend
pnpm --filter backend dev

# Frontend (w nowym terminalu)
pnpm --filter frontend dev
```

### Build produkcyjny
```bash
# Budowanie wszystkich serwisów
pnpm build

# Uruchomienie w produkcji
pnpm start
```

## Struktura projektu

```
staywell/
├── backend/                    # Serwer NestJS API
│   ├── src/
│   │   ├── app/
│   │   │   ├── apartments-section/    # Moduł apartamentów
│   │   │   │   ├── apartments/        # CRUD apartamentów
│   │   │   │   ├── amenities/         # Udogodnienia
│   │   │   │   ├── bed-types/         # Typy łóżek
│   │   │   │   ├── reviews/           # Recenzje
│   │   │   │   └── module.ts          # Moduł sekcji
│   │   │   ├── bookings-section/      # Moduł rezerwacji
│   │   │   ├── events-section/        # Moduł wydarzeń
│   │   │   ├── transactions-section/  # Moduł transakcji
│   │   │   ├── users-section/         # Moduł użytkowników
│   │   │   ├── app.module.ts          # Moduł główny
│   │   │   └── app.module.ts
│   │   └── lib/                       # Wspólne narzędzia
│   │       ├── common/                # Dekoratory, guardy, interceptory
│   │       ├── files/                 # Praca z plikami
│   │       ├── prisma/                # Klient Prisma
│   │       ├── redis/                 # Klient Redis
│   │       └── websocket/             # Adapter WebSocket
│   └── uploads/                       # Przesłane pliki
├── frontend/                  # Aplikacja Next.js
│   ├── src/
│   │   ├── app/                       # App Router
│   │   │   ├── admin/                 # Panel administratora
│   │   │   │   ├── apartments/        # Zarządzanie apartamentami
│   │   │   │   ├── bookings/          # Zarządzanie rezerwacjami
│   │   │   │   ├── events/            # Zarządzanie wydarzeniami
│   │   │   │   ├── users/             # Zarządzanie użytkownikami
│   │   │   │   ├── services/          # Zarządzanie usługami
│   │   │   │   └── layout.tsx         # Layout administratora
│   │   │   ├── auth/                  # Uwierzytelnianie
│   │   │   │   ├── login/             # Logowanie
│   │   │   │   └── register/          # Rejestracja
│   │   │   └── (app)/                 # Część publiczna
│   │   │       ├── apartment/[id]/    # Strona apartamentu
│   │   │       └── page.tsx           # Strona główna
│   │   ├── components/                # Komponenty
│   │   │   ├── admin/                 # Komponenty administratora
│   │   │   │   ├── common/            # Wspólne (AdminPage, Layout)
│   │   │   │   └── pages/             # Komponenty stron
│   │   │   ├── common/                # Komponenty wspólne
│   │   │   └── public/                # Komponenty publiczne
│   │   ├── hooks/                     # Hooki React
│   │   │   ├── admin/                 # Hooki administratora
│   │   │   ├── common/                # Hooki wspólne
│   │   │   └── public/                # Hooki publiczne
│   │   ├── lib/                       # Narzędzia i API
│   │   │   └── api/                   # Klienty API
│   │   └── stores/                    # Sklepy Zustand
│   └── public/                        # Pliki statyczne
├── shared/                    # Wspólna biblioteka
│   ├── prisma/                        # Schemat bazy danych i migracje
│   ├── src/
│   │   ├── common/                    # Wspólne typy
│   │   ├── database/                  # Klient Prisma
│   │   ├── models/                    # Modele danych
│   │   └── types/                     # Wygenerowane typy
│   └── seeds/                         # Dane początkowe
└── nginx.conf                 # Konfiguracja Nginx
```

## Backend API

### Architektura modułów

Każdy moduł funkcjonalny następuje wzorzec:
```
module/
├── controller.ts           # Kontroler HTTP
├── services/               # Logika biznesowa
│   ├── crud.service.ts     # Podstawowe operacje CRUD
│   ├── list.service.ts     # Operacje listy z filtrami
│   └── *.service.ts        # Specyficzne serwisy
├── dto/                    # Data Transfer Objects
│   ├── create.dto.ts       # DTO tworzenia
│   ├── update.dto.ts       # DTO aktualizacji
│   ├── filters.dto.ts      # DTO filtrów
│   └── index.ts            # Eksporty
└── module.ts               # Moduł NestJS
```

## Komponenty Frontend

### Architektura komponentów

Komponenty zorganizowane są według zasad atomic design:

#### Komponenty Admin
- **common/** - Komponenty wspólne (AdminPage, Layout, Form)
- **pages/** - Komponenty stron z logiką biznesową

#### Struktura komponentu strony
```
PageComponent/
├── PageComponent.tsx        # Główny komponent
├── PageComponent.module.scss # Style
├── index.ts                 # Eksport
└── components/              # Zagnieżdżone komponenty
    ├── SubComponent/
    │   ├── SubComponent.tsx
    │   ├── SubComponent.module.scss
    │   └── index.ts
    └── index.ts
```