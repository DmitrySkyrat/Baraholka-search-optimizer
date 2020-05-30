export interface BaraholkaTopic {
  id: string | null;
  price: number;
  dolPrice: number;
  city: string;
  el: HTMLTableRowElement;
}
export interface Category {
  id: string;
  name: string;
}
export interface BaraholkaSearchParams {
  searchText: string;
  category: Category;
  pageNum: number;
}
export interface Region {
  name: string;
  id: string;
}
export interface City {
  name: string;
  id: string;
}
export interface SearchParams {
  searchText: string;
  minPrice: number;
  maxPrice: number;
  selectedCategory: Category;
  selectedCities: City[];
}