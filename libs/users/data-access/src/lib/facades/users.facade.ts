import { computed, inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, UserOrdersVm, User, Order, UserTotalOrdersVm } from '@fmr/users/utils';
import { UsersActions } from '../+state/users.actions';
import { UsersSelectors } from '../+state/users.selectors';

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
  readonly $selectedUserSummary: Signal<UserTotalOrdersVm | null> = this.store.selectSignal(
    UsersSelectors.selectUserTotalOrdersVm
  );
  readonly $loading: Signal<boolean> = this.store.selectSignal(UsersSelectors.selectLoading);
  readonly $loaded: Signal<boolean> = this.store.selectSignal(UsersSelectors.selectLoaded);
  readonly $error: Signal<string | null> = this.store.selectSignal(UsersSelectors.selectError);

  readonly $vm: Signal<UserOrdersVm> = computed<UserOrdersVm>(() => ({
    users: this.$users(),
    selectedUserId: this.$selectedUserId(),
    selectedUserSummary: this.$selectedUserSummary(),
    orders: this.$selectedUserOrders(),
    loading: this.$loading(),
    loaded: this.$loaded(),
    error: this.$error()
  }));

  // load all current users
  loadUsers() {
    this.store.dispatch(UsersActions.loadUsers());
  }

  // SELECT USER + caching
  selectUser(userId: number) {
    this.store.dispatch(UsersActions.selectUser({ userId }));

    const orders = this.$selectedUserOrders();
    if (!orders || orders.length === 0) {
      this.store.dispatch(UsersActions.loadUserOrders({ userId }));
    }
  }

  //public crud api for future enhancements in the app
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
