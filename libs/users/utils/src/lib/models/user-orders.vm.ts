import { Order } from './order.interface';
import { User } from './user.interface';
import { UserTotalOrdersVm } from './user-total-orders.vm';

export interface UserOrdersVm {
  users: User[];
  selectedUserId: number | null;
  selectedUserSummary: UserTotalOrdersVm | null;
  orders: Order[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
