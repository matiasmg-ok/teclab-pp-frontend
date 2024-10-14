/*
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { DefaultData } from "./DefaultData";
import { Product } from "./Product";
import { User } from "./User";
import { OrderProduct } from "./OrderProduct";

@Entity("orders")
export class Order extends DefaultData {
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column("varchar", { length: 100, default: 'payment-pending' })
  status: 'payment-pending' | 'payment-completed' | 'in-progress' | 'shipping' | 'finished' | 'cancelled';

  @Column("text")
  shippingAddress: string;

  @Column("text")
  trackingCode: string;

  @Column("text")
  additionalNotes: string;

  @Column("varchar", { length: 150 })
  city: string;

  @Column("varchar", { length: 150 })
  province: string;

  @Column("varchar", { length: 150 })
  zip: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @Column('varchar', { length: 50 })
  currency: 'usd' | 'ars';

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
  products: OrderProduct[]
}
*/

export type Order = {
  status: 'payment-pending' | 'payment-completed' | 'in-progress' | 'shipping' | 'finished' | 'cancelled',
  shippingAddress: string,
  trackingCode: string,
  additionalNotes: string,
  city: string,
  province: string,
  zip: string,
  price: number,
  currency: 'usd' | 'ars',
}