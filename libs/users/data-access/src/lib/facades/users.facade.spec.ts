import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UsersFacade } from './users.facade';
import { UsersActions } from '../+state/users.actions';
import { UsersSelectors } from '../+state/users.selectors'; // <-- Updated import
import { User, Order, UserOrderSummary } from '@fmr/users/utils';

describe('UsersFacade', () => {
  let facade: UsersFacade;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersFacade,
        provideMockStore({
          // Initialize ALL selectors used in the Facade to prevent signal initialization errors
          selectors: [
            { selector: UsersSelectors.selectAllUsers, value: [] },
            { selector: UsersSelectors.selectSelectedUserId, value: null },
            { selector: UsersSelectors.selectSelectedUserOrders, value: [] },
            { selector: UsersSelectors.selectUserTotalOrdersVm, value: null },
            { selector: UsersSelectors.selectLoading, value: false },
            { selector: UsersSelectors.selectLoaded, value: false },
            { selector: UsersSelectors.selectError, value: null }
          ]
        })
      ]
    });

    facade = TestBed.inject(UsersFacade);
    store = TestBed.inject(MockStore);

    // Spy on the dispatch method to track actions sent to the store
    jest.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('Signals & ViewModel ($vm)', () => {
    it('should compute $vm correctly based on updated store selectors', () => {
      // Create mock data
      const mockUsers: User[] = [
        { id: 1, name: 'Avi Cohen', email: 'avi@test.com', city: 'Tel Aviv' }
      ];
      const mockOrders: Order[] = [
        { id: 101, userId: 1, title: 'Stock Purchase', amount: 500, createdAt: '2026-03-12' }
      ];
      const mockSummary: UserOrderSummary = {
        userName: 'Avi Cohen',
        totalAmount: 500,
        ordersCount: 1
      };

      // Override the store selectors with the mock data, including the new state flags
      store.overrideSelector(UsersSelectors.selectAllUsers, mockUsers);
      store.overrideSelector(UsersSelectors.selectSelectedUserId, 1);
      store.overrideSelector(UsersSelectors.selectSelectedUserOrders, mockOrders);
      store.overrideSelector(UsersSelectors.selectUserTotalOrdersVm, mockSummary);
      store.overrideSelector(UsersSelectors.selectLoading, true);
      store.overrideSelector(UsersSelectors.selectLoaded, false);
      store.overrideSelector(UsersSelectors.selectError, null);

      // Refresh the store state so the computed signals react to the new values
      store.refreshState();

      // Verify the computed signal evaluates correctly with all new properties
      expect(facade.$vm()).toEqual({
        users: mockUsers,
        selectedUserId: 1,
        selectedUserSummary: mockSummary,
        orders: mockOrders,
        loading: true,
        loaded: false,
        error: null
      });
    });
  });

  describe('loadUsers & Caching Logic', () => {
    it('should dispatch loadUsers when $users is empty', () => {
      store.overrideSelector(UsersSelectors.selectAllUsers, []);
      store.refreshState();

      facade.loadUsers();

      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadUsers());
    });

    it('should NOT dispatch loadUsers when $users already has data (Cache Hit)', () => {
      const mockUsers: User[] = [
        { id: 1, name: 'Avi Cohen', email: 'avi@test.com', city: 'Tel Aviv' }
      ];

      store.overrideSelector(UsersSelectors.selectAllUsers, mockUsers);
      store.refreshState();

      facade.loadUsers();

      expect(store.dispatch).not.toHaveBeenCalledWith(UsersActions.loadUsers());
    });
  });

  describe('selectUser & Caching Logic', () => {
    it('should dispatch selectUser AND loadUserOrders when $selectedUserOrders is empty', () => {
      facade.selectUser(1);

      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.selectUser({ userId: 1 }));
      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadUserOrders({ userId: 1 }));
    });

    it('should dispatch ONLY selectUser when $selectedUserOrders has data (Cache Hit)', () => {
      const mockOrders: Order[] = [
        { id: 101, userId: 1, title: 'Stock Purchase', amount: 300, createdAt: '2026-03-12' }
      ];
      store.overrideSelector(UsersSelectors.selectSelectedUserOrders, mockOrders);
      store.refreshState();

      facade.selectUser(1);

      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.selectUser({ userId: 1 }));
      // Ensure the redundant load action was NOT dispatched
      expect(store.dispatch).not.toHaveBeenCalledWith(UsersActions.loadUserOrders({ userId: 1 }));
    });
  });

  describe('CRUD API & Load Operations', () => {
    it('should dispatch loadUsers action', () => {
      facade.loadUsers();
      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadUsers());
    });

    it('should dispatch addUser action', () => {
      const newUser: User = { id: 2, name: 'Dana', email: 'dana@test.com', city: 'Haifa' };
      facade.addUser(newUser);
      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.addUser({ user: newUser }));
    });

    it('should dispatch updateUser action', () => {
      const updatedUser: User = { id: 2, name: 'Dana Levi', email: 'dana@test.com', city: 'Haifa' };
      facade.updateUser(updatedUser);
      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.updateUser({ user: updatedUser }));
    });

    it('should dispatch deleteUser action', () => {
      facade.deleteUser(2);
      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.deleteUser({ userId: 2 }));
    });
  });
});
