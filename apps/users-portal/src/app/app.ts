import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserOrdersComponent } from '@fmr/users/feature';
import { UserTotalOrdersComponent } from '@fmr/users/ui'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserOrdersComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
