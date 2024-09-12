export type Product = {
  id: number;
  name: string;
  description: string;
  group: string;
  price: number;
  imageUrl?: string;
  images?: any;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}