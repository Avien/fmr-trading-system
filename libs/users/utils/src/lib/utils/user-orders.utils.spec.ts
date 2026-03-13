import {
  buildUserTotalOrdersVm,
  getOrdersByUserId,
  getTotalOrdersAmount
} from './user-orders.utils';

import { Order } from '../models/order.interface';
import { User } from '../models/user.interface';

describe('user-orders.utils', () => {
  const mockOrders: Order[] = [
    { id: 1, userId: 101, total: 10 },
    { id: 2, userId: 101, total: 15.5 },
    { id: 3, userId: 202, total: 7.25 }
  ];

  const mockUser: User = {
    id: 101,
    name: 'Avi'
  };

  describe('getOrdersByUserId', () => {
    it('should return only orders for the selected user', () => {
      expect(getOrdersByUserId(mockOrders, 101)).toEqual([
        { id: 1, userId: 101, total: 10 },
        { id: 2, userId: 101, total: 15.5 }
      ]);
    });

    it('should return empty array when userId is null', () => {
      expect(getOrdersByUserId(mockOrders, null)).toEqual([]);
    });
  });

  describe('getTotalOrdersAmount', () => {
    it('should sum order totals', () => {
      expect(getTotalOrdersAmount(mockOrders)).toBe(32.75);
    });

    it('should return 0 for empty array', () => {
      expect(getTotalOrdersAmount([])).toBe(0);
    });
  });

  describe('buildUserTotalOrdersVm', () => {
    it('should build vm when user exists', () => {
      expect(
        buildUserTotalOrdersVm(mockUser, [
          { id: 1, userId: 101, total: 10 },
          { id: 2, userId: 101, total: 15.5 }
        ])
      ).toEqual({
        userName: 'Avi',
        totalAmount: 25.5
      });
    });

    it('should return null when user is missing', () => {
      expect(buildUserTotalOrdersVm(null, mockOrders)).toBeNull();
    });
  });
});
