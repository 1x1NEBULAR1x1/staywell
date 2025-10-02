import { GETTABLE_NAMES, GETTABLE_PATHS, CRUDDABLE_NAMES, CRUDDABLE_PATHS } from "./data";
/**
 * Преобразует GETTABLE_PATHS в GETTABLE_NAMES
 * @param path - путь модели (например, "locales")
 * @returns ключ модели (например, "LOCALE") или null если не найден
 */
export declare function getGettableNameFromPath(path: GETTABLE_PATHS): GETTABLE_NAMES | null;
/**
 * Проверяет, является ли строка валидным GETTABLE_PATHS
 * @param path - строка для проверки
 * @returns true если путь валиден
 */
export declare function isGettablePath(path: string): path is GETTABLE_PATHS;
/**
 * Type guard to check if a string is a valid MODEL_NAMES
 */
export declare const isGettableName: (value: string) => value is GETTABLE_NAMES;
/**
 * Type guard to check if a string is a valid CRUDDABLE_NAMES
 */
export declare const isCruddableName: (value: string) => value is CRUDDABLE_NAMES;
/**
 * Type guard to check if a string is a valid CRUDDABLE_PATHS
 */
export declare const isCruddablePath: (value: string) => value is CRUDDABLE_PATHS;
/**
 * Получает имя модели для связанного поля
 * @param field_name - имя поля
 * @returns имя модели или null если не найден
 */
export declare const getRelationModelName: (field_name: string) => GETTABLE_NAMES | null;
/**
 * Получает главное поле для связанной модели
 * @param item - объект модели
 * @returns label
 */
export declare const getRelationModelLabel: (item: object) => string;
/**
 * Получает опции для сортировки по полям модели
 * @param model - имя модели
 * @returns опции для сортировки
 */
export declare const getSortFieldOptions: (model: GETTABLE_NAMES) => {
    value: string;
    label: string;
}[];
