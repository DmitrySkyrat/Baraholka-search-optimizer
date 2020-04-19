export interface BaraholkaTopic {
  id: string | null;
  price: number;
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
