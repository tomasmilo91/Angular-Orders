import { Component, OnInit } from '@angular/core';
import { IOrder } from './order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less'],
})
export class OrderListComponent implements OnInit {
  public oderListTitle = 'Prehľad trvalých príkazov';

  products: IOrder[] = [
    {
      StandingOrderId: 1,
      Amount: 10.1,
      Name: 'Moj prikaz 1',
      AccountNumber: 'SK8681800000007000333333',
      Interval: '8',
      NextRealizationDate: 'March 25, 2020',
    },
    {
      StandingOrderId: 2,
      Amount: 10.25,
      Name: 'Moj prikaz 2',
      AccountNumber: 'SK8681800000007000333333',
      Interval: '12',
      NextRealizationDate: 'March 24, 2018',
    },
    {
      StandingOrderId: 3,
      Amount: 105.1,
      Name: 'Moj prikaz 3',
      AccountNumber: 'SK8681800000007000333333',
      Interval: '32',
      NextRealizationDate: 'March 20, 2017',
    },
    {
      StandingOrderId: 4,
      Amount: 140.1,
      Name: 'Moj prikaz 4',
      AccountNumber: 'SK8681800000007000333333',
      Interval: '33',
      NextRealizationDate: 'March 19, 2018',
    },
    {
      StandingOrderId: 5,
      Amount: 10.12,
      Name: 'Moj prikaz 5',
      AccountNumber: 'SK8681800000007000333333',
      Interval: '5',
      NextRealizationDate: 'March 25, 2019',
    },
  ];

  constructor() {}
  ngOnInit(): void {
    console.log('On init');
  }
}
