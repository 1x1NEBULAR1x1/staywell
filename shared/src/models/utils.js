"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortFieldOptions = exports.getRelationModelLabel = exports.getRelationModelName = exports.isCruddablePath = exports.isCruddableName = exports.isGettableName = void 0;
exports.getGettableNameFromPath = getGettableNameFromPath;
exports.isGettablePath = isGettablePath;
const data_1 = require("./data");
const types_1 = require("../types");
/**
 * Преобразует GETTABLE_PATHS в GETTABLE_NAMES
 * @param path - путь модели (например, "locales")
 * @returns ключ модели (например, "LOCALE") или null если не найден
 */
function getGettableNameFromPath(path) {
    const entry = Object.entries(data_1.GETTABLE_DATA).find(([_, value]) => value === path);
    const value = entry ? entry[0] : null;
    return value && (0, exports.isGettableName)(value) ? value : null;
}
/**
 * Проверяет, является ли строка валидным GETTABLE_PATHS
 * @param path - строка для проверки
 * @returns true если путь валиден
 */
function isGettablePath(path) {
    return Object.values(data_1.GETTABLE_DATA).includes(path);
}
/**
 * Type guard to check if a string is a valid MODEL_NAMES
 */
const isGettableName = (value) => {
    return value in data_1.GETTABLE_DATA;
};
exports.isGettableName = isGettableName;
/**
 * Type guard to check if a string is a valid CRUDDABLE_NAMES
 */
const isCruddableName = (value) => {
    return value in data_1.CRUDDABLE_DATA;
};
exports.isCruddableName = isCruddableName;
/**
 * Type guard to check if a string is a valid CRUDDABLE_PATHS
 */
const isCruddablePath = (value) => {
    return value in data_1.CRUDDABLE_DATA;
};
exports.isCruddablePath = isCruddablePath;
/**
 * Получает имя модели для связанного поля
 * @param field_name - имя поля
 * @returns имя модели или null если не найден
 */
const getRelationModelName = (field_name) => {
    switch (field_name) {
        case 'PARENT': return 'CATEGORY'; // parent_id -> CATEGORY
        default: return (0, exports.isGettableName)(field_name) ? field_name : null;
    }
};
exports.getRelationModelName = getRelationModelName;
/**
 * Получает главное поле для связанной модели
 * @param item - объект модели
 * @returns label
 */
const getRelationModelLabel = (item) => {
    if ('name' in item) {
        return String(item.name);
    }
    else if ('title' in item) {
        return String(item.title);
    }
    else if ('email' in item) {
        return String(item.email);
    }
    else if ('address' in item) {
        return String(item.address);
    }
    else {
        return String(item);
    }
};
exports.getRelationModelLabel = getRelationModelLabel;
const getModelFields = (model) => {
    switch (model) {
        case 'ADDRESS':
            return Object.keys(types_1.example_address).map((key) => ({ value: key, label: key }));
        case 'CATEGORY':
            return Object.keys(types_1.example_category).map((key) => ({ value: key, label: key }));
        case 'EQUIPMENT':
            return Object.keys(types_1.example_equipment).map((key) => ({ value: key, label: key }));
        case 'EQUIPMENT_IMAGE':
            return Object.keys(types_1.example_equipment_image).map((key) => ({ value: key, label: key }));
        case 'LOCAL_CATEGORY':
            return Object.keys(types_1.example_local_category).map((key) => ({ value: key, label: key }));
        case 'LOCAL_EQUIPMENT':
            return Object.keys(types_1.example_local_equipment).map((key) => ({ value: key, label: key }));
        case 'LOCAL_EQUIPMENT_DESCRIPTION':
            return Object.keys(types_1.example_local_equipment_description).map((key) => ({ value: key, label: key }));
        case 'LOCALE':
            return Object.keys(types_1.example_locale).map((key) => ({ value: key, label: key }));
        case 'RENTAL':
            return Object.keys(types_1.example_rental).map((key) => ({ value: key, label: key }));
        case 'RENTAL_EQUIPMENT':
            return Object.keys(types_1.example_rental_equipment).map((key) => ({ value: key, label: key }));
        case 'USER':
            return Object.keys(types_1.example_safe_user).map((key) => ({ value: key, label: key }));
        case 'SESSION':
            return Object.keys(types_1.example_session).map((key) => ({ value: key, label: key }));
    }
};
/**
 * Получает опции для сортировки по полям модели
 * @param model - имя модели
 * @returns опции для сортировки
 */
const getSortFieldOptions = (model) => {
    return getModelFields(model).concat([{ value: '', label: 'any' }]);
};
exports.getSortFieldOptions = getSortFieldOptions;
