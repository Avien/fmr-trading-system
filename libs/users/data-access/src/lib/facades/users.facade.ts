import { computed, inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, UserOrdersVm, User, Order, UserOrderSummary } from '@fmr/users/utils';
import { UsersActions } from '../+state/users.actions';
import { UsersSelectors } from '../+state/users.selectors';

/**
 * UsersFacade
 *
 * Encapsulates all interaction with the NgRx store and side effects.
 * UI components depend only on Angular Signals exposed via the $vm and remain
 * completely unaware of NgRx implementation details.
 *
 * This keeps components simple, testable, and decoupled from state management.
 */
@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private store: Store<AppState> = inject(Store<AppState>);

  readonly $users: Signal<User[]> = this.store.selectSignal(UsersSelectors.selectAllUsers);
  readonly $selectedUserId: Signal<number | null> = this.store.selectSignal(
    UsersSelectors.selectSelectedUserId
  );
  readonly $selectedUserOrders: Signal<Order[]> = this.store.selectSignal(
    UsersSelectors.selectSelectedUserOrders
  );
  readonly $selectedUserOrderSummary: Signal<UserOrderSummary | null> = this.store.selectSignal(
    UsersSelectors.selectUserOrderSummary
  );
  readonly $loadedUserOrderIds: Signal<number[]> = this.store.selectSignal(
    UsersSelectors.selectLoadedUserOrderIds
  );
  readonly $loading: Signal<boolean> = this.store.selectSignal(UsersSelectors.selectLoading);
  readonly $loaded: Signal<boolean> = this.store.selectSignal(UsersSelectors.selectLoaded);
  readonly $error: Signal<string | null> = this.store.selectSignal(UsersSelectors.selectError);

  readonly $vm: Signal<UserOrdersVm> = computed<UserOrdersVm>(() => ({
    users: this.$users(),
    selectedUserId: this.$selectedUserId(),
    selectedUserSummary: this.$selectedUserOrderSummary(),
    orders: this.$selectedUserOrders(),
    loading: this.$loading(),
    loaded: this.$loaded(),
    error: this.$error()
  }));

  /**
   * Loads users if they are not already present in the store.
   * Prevents redundant API requests by using cached state when available.
   */
  loadUsers() {
    const users = this.$users();

    if (!users || users.length === 0) {
      this.store.dispatch(UsersActions.loadUsers());
    }
  }

  /**
   * Select a user and load their orders if they are not already cached
   * @param userId
   */
  selectUser(userId: number) {
    this.store.dispatch(UsersActions.selectUser({ userId }));

    // Cache hit is based on successful API load for this specific user,
    // not on whether any WS order happens to be present.
    const hasLoadedOrdersForUser = this.$loadedUserOrderIds().includes(userId);
    if (!hasLoadedOrdersForUser) {
      this.store.dispatch(UsersActions.loadUserOrders({ userId }));
    }
  }

  //public CRUD apis for future enhancements in the app
  addUser(user: User) {
    this.store.dispatch(UsersActions.addUser({ user }));
  }

  updateUser(user: User) {
    this.store.dispatch(UsersActions.updateUser({ user }));
  }

  deleteUser(userId: number) {
    this.store.dispatch(UsersActions.deleteUser({ userId }));
  }
}
