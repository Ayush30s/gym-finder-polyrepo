export type FilterType = "rating" | "price" | "location" | null;

export interface FilterState {
  sortBy: FilterType;
  locationQuery: string;
}

export interface FormError {
  email?: string;
  password?: string;
  name?: string;
  general?: string;
}
