import { Order } from './order.interface';
import { User } from './user.interface';
import { UserTotalOrdersVm } from './user-total-orders.vm';

/**
 * ViewModel consumed by the feature component.
 * Combines users data, selected user state and loading indicators.
 */
export interface UserOrdersVm {
  users: User[];
  selectedUserId: number | null;
  selectedUserSummary: UserTotalOrdersVm | null;
  orders: Order[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
