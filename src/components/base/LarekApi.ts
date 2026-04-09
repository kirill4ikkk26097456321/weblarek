import { Api } from './Api';
import { IOrder, IOrderResult, IProductList } from '../../types';

export interface ILarekApi {
  getProducts: () => Promise<IProductList>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  getProducts(): Promise<IProductList> {
    return this.get<IProductList>('/product');
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>('/order', order);
  }
}