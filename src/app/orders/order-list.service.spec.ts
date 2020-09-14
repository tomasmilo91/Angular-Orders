/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrderListService } from './order-list.service';

describe('Service: OrderList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderListService],
    });
  });

  it('should ...', inject([OrderListService], (service: OrderListService) => {
    expect(service).toBeTruthy();
  }));
});
