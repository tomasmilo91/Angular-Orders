import { OrderListService } from './../order-list/order-list.service';
import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.less'],
})
export class IntervalComponent implements OnInit {
  @Input() form: FormGroup;

  // interval
  interval = [[1], [2], [3]];
  intervalSpecification = [
    [],
    [], // for interval = 1
    [...Array(7).keys()].map((x) => x + 1), // for interval = 2
    [...Array(31).keys()].map((x) => x + 1), // for interval = 3
  ];

  constructor(public orderListService: OrderListService) {}

  ngOnInit(): void {
    // Listen to interval form for changes because of validators and disable intervalSpecification if interval = 1
    this.form
      .get('interval')
      .valueChanges.subscribe((data) => this.onIntervalChanged(data));
  }

  onIntervalChanged(value: any): void {
    // cant be const
    let intervalSpecificationForm = this.form.get('intervalSpecification');
    // Using setValidators to add and remove validators. No better support for adding and removing validators to controller atm.
    if (value !== 1) {
      intervalSpecificationForm.enable();
      intervalSpecificationForm.clearValidators();
      intervalSpecificationForm.setValidators([Validators.required]);
    } else {
      intervalSpecificationForm.clearValidators();
      intervalSpecificationForm.disable();
    }
    intervalSpecificationForm.updateValueAndValidity(); // Need to call this to trigger a update
  }

  getInterval(interval: number): string {
    let result = 'Nedefinovaný';
    const x = interval;
    switch (true) {
      case x === 1:
        result = ' Denne';
        break;
      case x === 2:
        result = ' Týždenne';
        break;
      case x === 3:
        result = ' Mesačne';
        break;
      default:
        break;
    }
    return result;
  }
}
