import { OrderListService } from './order-list.service';
import { Component, OnInit } from '@angular/core';
import { IOrder } from '../order';
import { map } from 'rxjs/internal/operators';

export interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less'],
})
export class OrderListComponent implements OnInit {
  errorMessage: string;
  changeText: boolean;

  orders: IOrder[] = [];

  constructor(private orderListService: OrderListService) {
    this.changeText = false;
  }

  ngOnInit(): void {
    console.log('In OnInit');
    this.orderListService
      .getOrders()
      .pipe(map((orders) => (this.orders = orders)))
      .subscribe();
  }

  /* Returns total amount of standing orders */
  getTotalAmount(): number {
    return this.orders
      .map((t) => t.amount)
      .reduce((acc, value) => acc + value, 0);
  }

  /* Returns length of standing orders arrays with respective text  */
  getSum(): string {
    let vysledok = 'empty';
    const x = this.orders.length;
    switch (true) {
      case x >= 5:
        vysledok = ' trvalých príkazov';
        break;
      case x === 0:
        vysledok = ' trvalých príkazov';
        break;
      case x === 1:
        vysledok = ' trvalý príkaz';
        break;
      case x >= 2 && x <= 4:
        vysledok = ' trvalé príkazy';
        break;
      default:
        break;
    }
    return x + vysledok;
  }
}
