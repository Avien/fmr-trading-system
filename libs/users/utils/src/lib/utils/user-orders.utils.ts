import { Order } from '../models/order.interface';
import { UserTotalOrdersVm } from '../models/user-total-orders.vm';
import { User } from '../models/user.interface';

export function getOrdersByUserId(orders: Order[], userId: number | null): Order[] {
  if (userId == null) {
    return [];
  }

  return orders.filter((order) => order.userId === userId);
}

export function getTotalOrdersAmount(orders: Order[]): number {
  return orders.reduce((sum, order) => sum + order.total, 0);
}

export function buildUserTotalOrdersVm(
  user: User | null,
  orders: Order[]
): UserTotalOrdersVm | null {
  if (!user) {
    return null;
  }

  return {
    userName: user.name,
    totalAmount: getTotalOrdersAmount(orders)
  };
}
