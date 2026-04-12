import { Api } from './base/Api';
import { IOrder, IOrderResult, IProductList } from '../types';

export interface ILarekApi {
  getProducts: () => Promise<IProductList>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi implements ILarekApi {
  private _baseApi: Api;

  constructor(baseApi: Api) {
    this._baseApi = baseApi;
  }

  getProducts(): Promise<IProductList> {
    return this._baseApi.get<IProductList>('/product');
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this._baseApi.post<IOrderResult>('/order', order);
  }
}