"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelationModelLabel = exports.getRelationModelName = exports.isCruddablePath = exports.isCruddableName = exports.isGettableName = void 0;
exports.getGettableNameFromPath = getGettableNameFromPath;
exports.isGettablePath = isGettablePath;
const data_1 = require("./data");
/**
 * Converts GETTABLE_PATHS to GETTABLE_NAMES
 * @param path - model path (e.g., "locales")
 * @returns model key (e.g., "LOCALE") or null if not found
 */
function getGettableNameFromPath(path) {
    const entry = Object.entries(data_1.GETTABLE_DATA).find(([_, value]) => value === path);
    const value = entry ? entry[0] : null;
    return value && (0, exports.isGettableName)(value) ? value : null;
}
/**
 * Checks if string is valid GETTABLE_PATHS
 * @param path - string to check
 * @returns true if path is valid
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
 * Gets model name for related field
 * @param field_name - field name
 * @returns model name or null if not found
 */
const getRelationModelName = (field_name) => {
    switch (field_name) {
        default: return (0, exports.isGettableName)(field_name) ? field_name : null;
    }
};
exports.getRelationModelName = getRelationModelName;
/**
 * Gets main field for related model
 * @param item - model object
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
// const getModelFields = (model: GETTABLE_NAMES) => { TODO: add model fields
//   switch (model) {
//     case 'USER':
//       return Object.keys(example_safe_user).map((key) => ({ value: key, label: key }));
//   }
// }
// /** TODO: uncomment before completion
//  * Gets options for sorting by model fields
//  * @param model - model name
//  * @returns sorting options
//  */
// export const getSortFieldOptions = (model: GETTABLE_NAMES) => {
//   return getModelFields(model).concat([{ value: '', label: 'any' }]);
// }
