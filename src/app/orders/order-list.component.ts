import { OrderListService } from './order-list.service';
import { Component, OnInit } from '@angular/core';
import { IOrder } from './order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less'],
})
export class OrderListComponent implements OnInit {
  public oderListTitle = 'Prehľad trvalých príkazov';
  errorMessage: string;

  products: IOrder[] = [];

  constructor(private orderListService: OrderListService) {}

  ngOnInit(): void {
    console.log('In OnInit');
    this.orderListService.getOrders().subscribe(
      (products) => {
        this.products = products;
      },
      (error) => (this.errorMessage = error)
    );
  }
}
