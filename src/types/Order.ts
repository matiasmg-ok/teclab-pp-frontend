import { Product } from "./Product";
import { User } from "./User";

export type Order = {
  id: number,
  status: 'payment-pending' | 'payment-completed' | 'in-progress' | 'shipping' | 'finished' | 'cancelled',
  createdAt: Date,
  shippingAddress: string,
  trackingCode: string,
  additionalNotes: string,
  city: string,
  province: string,
  zip: string,
  price: number,
  currency: 'usd' | 'ars',
  products: {
    product: Product
  }[],
  user?: User
}