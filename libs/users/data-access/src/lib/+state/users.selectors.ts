import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  Order,
  OrdersState,
  ORDERS_FEATURE_KEY,
  USERS_FEATURE_KEY,
  UserTotalOrdersVm,
  UsersState
} from '@fmr/users/utils';
import { ordersAdapter } from './orders.reducer';
import { usersAdapter } from './users.reducer';

const selectUsersState = createFeatureSelector<UsersState>(USERS_FEATURE_KEY);
const selectOrdersState = createFeatureSelector<OrdersState>(ORDERS_FEATURE_KEY);

const usersSelectors = usersAdapter.getSelectors();
const ordersSelectors = ordersAdapter.getSelectors();

const selectAllUsers = createSelector(selectUsersState, usersSelectors.selectAll);

const selectUsersEntities = createSelector(selectUsersState, usersSelectors.selectEntities);

const selectSelectedUserId = createSelector(selectUsersState, (state) => state.selectedUserId);

const selectAllOrders = createSelector(selectOrdersState, ordersSelectors.selectAll);

const selectSelectedUser = createSelector(
  selectUsersEntities,
  selectSelectedUserId,
  (entities, selectedUserId) => (selectedUserId == null ? null : (entities[selectedUserId] ?? null))
);

const selectSelectedUserOrders = createSelector(
  selectAllOrders,
  selectSelectedUserId,
  (orders, selectedUserId): Order[] =>
    selectedUserId == null ? [] : orders.filter((order) => order.userId === selectedUserId)
);

const selectUserTotalOrdersVm = createSelector(
  selectSelectedUser,
  selectSelectedUserOrders,
  (selectedUser, orders): UserTotalOrdersVm | null => {
    if (!selectedUser) {
      return null;
    }

    return {
      userName: selectedUser.name,
      totalAmount: orders.reduce((sum, order) => sum + order.total, 0)
    };
  }
);

const selectUsersLoading = createSelector(selectUsersState, (state) => state.loading);

const selectUsersLoaded = createSelector(selectUsersState, (state) => state.loaded);

const selectUsersError = createSelector(selectUsersState, (state) => state.error);

const selectOrdersLoading = createSelector(selectOrdersState, (state) => state.loading);

const selectOrdersLoaded = createSelector(selectOrdersState, (state) => state.loaded);

const selectOrdersError = createSelector(selectOrdersState, (state) => state.error);

const selectLoading = createSelector(
  selectUsersLoading,
  selectOrdersLoading,
  (usersLoading, ordersLoading) => usersLoading || ordersLoading
);

const selectLoaded = createSelector(
  selectUsersLoaded,
  selectOrdersLoaded,
  (usersLoaded, ordersLoaded) => usersLoaded || ordersLoaded
);

const selectError = createSelector(
  selectUsersError,
  selectOrdersError,
  (usersError, ordersError) => usersError || ordersError
);

const selectOrdersLoadedForUser = (userId: number) =>
  createSelector(selectAllOrders, (orders: Order[]) =>
    orders.some((order) => order.userId === userId)
  );

export const UsersSelectors = {
  selectAllUsers,
  selectSelectedUserId,
  selectSelectedUserOrders,
  selectUserTotalOrdersVm,
  selectLoading,
  selectLoaded,
  selectError,
  selectOrdersLoadedForUser
};
