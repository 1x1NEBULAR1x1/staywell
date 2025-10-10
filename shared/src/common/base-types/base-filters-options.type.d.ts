import { SortDirection } from "./sort-direction.enum";
/**
 * Base interface for all filtering parameters in the application
 * Provides common functionality for pagination and sorting
 */
export interface BaseFiltersOptions<T extends {
    id: string;
}> {
    skip: number;
    take: number;
    sort_field?: keyof T;
    sort_direction?: SortDirection;
    start_date?: Date;
    end_date?: Date;
    is_excluded?: boolean;
    search?: string;
}
