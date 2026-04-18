import { Injectable } from '@angular/core';
import { filter, Observable, map } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { Order } from '@fmr/users/utils';

interface OrderSocketEvent {
  type: 'order-update';
  payload: Order;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private socket$ = webSocket<OrderSocketEvent>('ws://localhost:3000/orders');

  public ordersUpdates$: Observable<Order> = this.socket$.pipe(
    filter((event: OrderSocketEvent) => event.type === 'order-update'),
    map((event: OrderSocketEvent) => event.payload)
  );
}
