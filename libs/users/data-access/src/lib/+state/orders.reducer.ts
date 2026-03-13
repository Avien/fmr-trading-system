import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Order, OrdersState } from '@fmr/users/utils';
import { UsersActions } from './users.actions';

export const ordersAdapter = createEntityAdapter<Order>();

export const initialOrdersState: OrdersState = ordersAdapter.getInitialState({
  loading: false,
  loaded: false,
  error: null
});

export const ordersReducer = createReducer(
  initialOrdersState,

  on(UsersActions.loadUserOrders, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  /**
   * @action loadUserOrdersSuccess
   * @description
   * Updates the store with fresh orders for a specific user while ensuring perfect
   * synchronization with the server (handling server-side deletions).
   * * @logic
   * 1. THE PROBLEM: If we only use `upsertMany`, orders deleted on the server will
   * remain stuck in the client state (because they aren't in the incoming payload).
   * 2. THE SOLUTION: We must "flush" the user's old orders before inserting the new ones.
   * 3. OPTIMIZATION: Instead of extracting Object.values() and chaining multiple array
   * methods (map -> filter -> map), we iterate over `state.ids` exactly ONCE.
   * We leverage `state.entities[id]` for an O(1) time-complexity lookup.
   * 4. Finally, we chain NgRx's highly optimized `removeMany` and `upsertMany`
   * to maintain immutability and performance.
   */
  on(UsersActions.loadUserOrdersSuccess, (state, { userId, orders }) => {
    //Remove any existing orders belonging to this user before inserting the fresh ones.
    //This keeps the entity state normalized and prevents stale data.
    const staleOrderIds = (state.ids as number[]).filter(
      (id) => state.entities[id]?.userId === userId
    );

    const stateAfterRemoval = ordersAdapter.removeMany(staleOrderIds, state);

    return ordersAdapter.upsertMany(orders, {
      ...stateAfterRemoval,
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(UsersActions.loadUserOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error
  })),

  on(UsersActions.deleteUserSuccess, (state, { userId }) => {
    const deletedUserOrderIds = (state.ids as number[]).filter(
      (id) => state.entities[id]?.userId === userId
    );

    return ordersAdapter.removeMany(deletedUserOrderIds, state);
  })
);
