export interface IUser extends INewUser {
    id: number
}
 
export interface INewUser {
  name:string,
  password:string,
  email:string,
  mobile:string,
  address:string
}