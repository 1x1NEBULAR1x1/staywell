import { GETTABLE_DATA, GETTABLE_NAMES, GETTABLE_PATHS, CRUDDABLE_DATA, CRUDDABLE_NAMES, CRUDDABLE_PATHS } from "./data";

import {
  example_safe_user
} from "../types";

/**
 * Converts GETTABLE_PATHS to GETTABLE_NAMES
 * @param path - model path (e.g., "locales")
 * @returns model key (e.g., "LOCALE") or null if not found
 */
export function getGettableNameFromPath(path: GETTABLE_PATHS): GETTABLE_NAMES | null {
  const entry = Object.entries(GETTABLE_DATA).find(([_, value]) => value === path);
  const value = entry ? entry[0] : null;
  return value && isGettableName(value) ? value : null;
}

/**
 * Checks if string is valid GETTABLE_PATHS
 * @param path - string to check
 * @returns true if path is valid
 */
export function isGettablePath(path: string): path is GETTABLE_PATHS {
  return Object.values(GETTABLE_DATA).includes(path as GETTABLE_PATHS);
}

/**
 * Type guard to check if a string is a valid MODEL_NAMES
 */
export const isGettableName = (value: string): value is GETTABLE_NAMES => {
  return value in GETTABLE_DATA;
};

/**
 * Type guard to check if a string is a valid CRUDDABLE_NAMES
 */
export const isCruddableName = (value: string): value is CRUDDABLE_NAMES => {
  return value in CRUDDABLE_DATA;
};

/**
 * Type guard to check if a string is a valid CRUDDABLE_PATHS
 */
export const isCruddablePath = (value: string): value is CRUDDABLE_PATHS => {
  return value in CRUDDABLE_DATA;
};


/**
 * Gets model name for related field
 * @param field_name - field name
 * @returns model name or null if not found
 */
export const getRelationModelName = (field_name: string): GETTABLE_NAMES | null => {
  switch (field_name) {
    default: return isGettableName(field_name) ? field_name : null;
  }
};

/**
 * Gets main field for related model
 * @param item - model object
 * @returns label
 */
export const getRelationModelLabel = (item: object): string => {
  if ('name' in item) {
    return String(item.name);
  } else if ('title' in item) {
    return String(item.title);
  } else if ('email' in item) {
    return String(item.email);
  } else if ('address' in item) {
    return String(item.address);
  } else {
    return String(item);
  }
};

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