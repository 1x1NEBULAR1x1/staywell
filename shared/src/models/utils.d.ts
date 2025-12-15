import { GETTABLE_NAMES, GETTABLE_PATHS, CRUDDABLE_NAMES, CRUDDABLE_PATHS } from "./data";
/**
 * Converts GETTABLE_PATHS to GETTABLE_NAMES
 * @param path - model path (e.g., "locales")
 * @returns model key (e.g., "LOCALE") or null if not found
 */
export declare function getGettableNameFromPath(path: GETTABLE_PATHS): GETTABLE_NAMES | null;
/**
 * Checks if string is valid GETTABLE_PATHS
 * @param path - string to check
 * @returns true if path is valid
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
 * Gets model name for related field
 * @param field_name - field name
 * @returns model name or null if not found
 */
export declare const getRelationModelName: (field_name: string) => GETTABLE_NAMES | null;
/**
 * Gets main field for related model
 * @param item - model object
 * @returns label
 */
export declare const getRelationModelLabel: (item: object) => string;
