import { UsersInterface } from "./Users.interface";

interface DataUser extends Pick<UsersInterface, "name" | "CPF"> {
  id: any;
}

export interface ProductsInterface {
  owner: DataUser;
  name: string;
  category: string;
  modelVehicle: string;
  year: number;
  brand: string;
  images?: string[];
  description: string;
  status: "available" | "sold" | "pending";
  buyer?: DataUser;
  userIntention?: DataUser[];
}
