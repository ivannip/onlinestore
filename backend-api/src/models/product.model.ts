export interface IProduct extends INewProduct {
  id: number,
}

export interface IProducts {
  products: IProduct []
}

export interface INewProduct {
  name:string,
  description:string,
  price: number,
  inventory:number,
  image:string,
  unitOfPackage:string
}
