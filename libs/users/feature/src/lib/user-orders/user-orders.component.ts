import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { UsersFacade } from '@fmr/users/data-access';
import { UserNameComponent, UserTotalOrdersComponent } from '@fmr/users/ui';

@Component({
  selector: 'fmr-user-orders',
  standalone: true,
  imports: [UserNameComponent, UserTotalOrdersComponent, DecimalPipe],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserOrdersComponent implements OnInit {
  readonly facade: UsersFacade = inject(UsersFacade);

  ngOnInit(): void {
    this.facade.loadUsers();
  }

  selectUser(userId: number): void {
    this.facade.selectUser(userId);
  }
}
