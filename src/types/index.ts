export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type FormErrors = Partial<Record<keyof IBuyer, string>>;

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IProductList {
  total: number;
  items: IProduct[];
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
