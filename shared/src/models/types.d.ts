import type { CRUDDABLE_NAMES, GETTABLE_NAMES } from "./data";
import type { BaseFiltersOptions } from '../common/base-types/base-filters.interface';
import type { Locale, EquipmentImage, LocalEquipmentDescription } from "../database";
import { ExtendedCategory, CategoriesFilters, CreateCategory, UpdateCategory, ExtendedLocalCategory, LocalCategoriesFilters, CreateLocalCategory, UpdateLocalCategory } from "../types/categories-section";
import { ExtendedEquipment, EquipmentsFilters, CreateEquipment, UpdateEquipment, EquipmentImagesFilters, CreateEquipmentImage, UpdateEquipmentImage, ExtendedLocalEquipment, LocalEquipmentsFilters, CreateLocalEquipment, UpdateLocalEquipment, LocalEquipmentDescriptionsFilters, CreateLocalEquipmentDescription, UpdateLocalEquipmentDescription } from "../types/equipments-section";
import { LocalesFilters, CreateLocale, UpdateLocale } from "../types/locales-section";
import { ExtendedRental, RentalsFilters, CreateRental, UpdateRental, ExtendedRentalEquipment, RentalEquipmentsFilters, CreateRentalEquipment, UpdateRentalEquipment } from '../types/rentals-section';
import { ExtendedAddress, AddressesFilters, CreateAddress, UpdateAddress, UserWithoutPassword, UsersFilters, Session, SessionsFilters } from '../types/users-section';
interface CruddableTypeShape<M extends {
    id: string;
}, F extends BaseFiltersOptions<M>, C, U extends Partial<C>> {
    model: M;
    filters: F;
    create: C;
    update: U;
}
export type CruddableTypes<T extends CRUDDABLE_NAMES> = T extends 'CATEGORY' ? CruddableTypeShape<ExtendedCategory, CategoriesFilters, CreateCategory, UpdateCategory> : T extends 'LOCAL_CATEGORY' ? CruddableTypeShape<ExtendedLocalCategory, LocalCategoriesFilters, CreateLocalCategory, UpdateLocalCategory> : T extends 'EQUIPMENT' ? CruddableTypeShape<ExtendedEquipment, EquipmentsFilters, CreateEquipment, UpdateEquipment> : T extends 'EQUIPMENT_IMAGE' ? CruddableTypeShape<EquipmentImage, EquipmentImagesFilters, CreateEquipmentImage, UpdateEquipmentImage> : T extends 'LOCAL_EQUIPMENT' ? CruddableTypeShape<ExtendedLocalEquipment, LocalEquipmentsFilters, CreateLocalEquipment, UpdateLocalEquipment> : T extends 'LOCAL_EQUIPMENT_DESCRIPTION' ? CruddableTypeShape<LocalEquipmentDescription, LocalEquipmentDescriptionsFilters, CreateLocalEquipmentDescription, UpdateLocalEquipmentDescription> : T extends 'LOCALE' ? CruddableTypeShape<Locale, LocalesFilters, CreateLocale, UpdateLocale> : T extends 'RENTAL' ? CruddableTypeShape<ExtendedRental, RentalsFilters, CreateRental, UpdateRental> : T extends 'RENTAL_EQUIPMENT' ? CruddableTypeShape<ExtendedRentalEquipment, RentalEquipmentsFilters, CreateRentalEquipment, UpdateRentalEquipment> : T extends 'ADDRESS' ? CruddableTypeShape<ExtendedAddress, AddressesFilters, CreateAddress, UpdateAddress> : never;
interface GettableTypeShape<M extends {
    id: string;
}, F extends BaseFiltersOptions<M>> {
    model: M;
    filters: F;
}
export type GettableTypes<T extends GETTABLE_NAMES> = T extends CRUDDABLE_NAMES ? CruddableTypes<T> extends CruddableTypeShape<infer M, infer F, unknown, Partial<unknown>> ? GettableTypeShape<M, F> : never : T extends 'USER' ? GettableTypeShape<UserWithoutPassword, UsersFilters> : T extends 'SESSION' ? GettableTypeShape<Session, SessionsFilters> : never;
export {};
