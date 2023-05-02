import {IProduct} from "./product.model"

export interface ITransaction {
  id: number,
  quantity: number,
  purchaseDate: Date,
  createDate: Date,
  product: IProduct
}

export interface INewTransaction {
  productId: number,
  quantity: number
}