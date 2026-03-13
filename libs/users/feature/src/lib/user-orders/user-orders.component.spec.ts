import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { UserOrdersComponent } from './user-orders.component';
import { UsersFacade } from '@fmr/users/data-access';
import { UserOrdersVm } from '@fmr/users/utils';

describe('UserOrdersComponent', () => {
  let component: UserOrdersComponent;
  let fixture: ComponentFixture<UserOrdersComponent>;
  let mockFacade: any;

  beforeEach(async () => {
    // 1. Create a mock Facade
    // We use WritableSignals so we can easily change the state during tests
    mockFacade = {
      loadUsers: jest.fn(),
      selectUser: jest.fn(),

      // Mocking the Signals
      $loading: signal(false),
      $error: signal<string | null>(null),
      $vm: signal<UserOrdersVm>({
        users: [],
        selectedUserId: null,
        selectedUserSummary: null,
        orders: [],
        loading: false,
        loaded: false,
        error: null
      })
    };

    await TestBed.configureTestingModule({
      imports: [UserOrdersComponent], // Standalone components go in imports
      providers: [
        // 2. Override the real Facade with our Mock
        { provide: UsersFacade, useValue: mockFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserOrdersComponent);
    component = fixture.componentInstance;

    // 3. Trigger initial data binding and ngOnInit
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUsers from the facade on initialization', () => {
    // Because we called fixture.detectChanges() in beforeEach, ngOnInit has run
    expect(mockFacade.loadUsers).toHaveBeenCalledTimes(1);
  });

  it('should call selectUser on the facade when triggered', () => {
    const testUserId = 42;
    component.selectUser(testUserId);

    expect(mockFacade.selectUser).toHaveBeenCalledWith(testUserId);
  });
});
