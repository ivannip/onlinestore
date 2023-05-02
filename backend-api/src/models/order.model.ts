import { INewTransaction } from './transaction.model';

export interface IOrder extends INewOrder{
  id: number,
}

export interface INewOrder {
    customer: string,
    contact: string,
    createDate?: Date,
    deliveryDate?: Date,
    deliveryAddress: string,
    purchasedItems: INewTransaction[]
}

//export interface IFindAllRequest extends Request {};
//export interface IUpdateStatusRequest extends Request<any, any, IList> {};
