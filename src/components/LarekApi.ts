import { IOrder, IOrderResult, IProductList, IApi } from '../types';

export interface ILarekApi {
  getProducts: () => Promise<IProductList>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi implements ILarekApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getProducts(): Promise<IProductList> {
    return this._baseApi.get<IProductList>('/product');
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this._baseApi.post<IOrderResult>('/order', order);
  }
}