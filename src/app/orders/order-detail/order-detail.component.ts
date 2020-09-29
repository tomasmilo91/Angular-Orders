import { ConstantListComponent } from './../../constant-list/constant-list.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderListService } from '../order-list/order-list.service';
import { NotificationService } from '../notification.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { IOrder } from 'src/app/model/order';

@Component({
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.less'],
})
export class OrderDetailComponent implements OnInit {
  order: IOrder;

  minDate: Date;
  maxDate: Date;
  constructor(
    private route: ActivatedRoute, // inject activated route
    private router: Router,
    public orderListService: OrderListService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    public dialogDetailRef: MatDialogRef<OrderDetailComponent>
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 100, 11, 31);
  }

  onBack(): void {
    this.router.navigate(['/orders']);
  }

  ngOnInit(): void {
    // Listen to interval form for changes because of validators and disable intervalSpecification if interval = 1
    this.orderListService.form
      .get('interval')
      .valueChanges.subscribe((data) =>
        this.orderListService.onIntervalChanged(data)
      );
  }

  onClear(): void {
    this.orderListService.resetAndInitialize();
    this.notificationService.success(':: Úspešne vymazaný formulár');
  }

  onClose(): void {
    this.orderListService.resetAndInitialize();
    this.dialogDetailRef.close();
  }

  openVariables(): void {
    const dialogConfigVariables = new MatDialogConfig();
    dialogConfigVariables.disableClose = true;
    dialogConfigVariables.autoFocus = true;
    dialogConfigVariables.width = '700px';
    dialogConfigVariables.height = '400px';
    this.dialog.open(ConstantListComponent, dialogConfigVariables);
  }

  onSubmit(): void {
    if (this.orderListService.form.valid) {
      this.order = this.orderListService.form.value;
      // workaround because we dont use accountId but backend service require some value
      this.order.accountId = 1;
      // workaround because if interval == 1, intervalSpecification = null but backend service require some value
      if (this.order.interval === 1) {
        this.order.intervalSpecification = 1;
      }

      // call post method
      if (this.orderListService.forCreate === true) {
        console.log(this.order);
        this.orderListService.addOrder(this.order).subscribe(
          (data) => {
            this.orderListService.orders.push(data);
            this.notificationService.success(':: Úspešne vložené');
            this.orderListService.resetAndInitialize();
            this.dialogDetailRef.close();
          },
          (Error) => {
            alert(Error);
          }
        );

        // call put method
      } else {
        this.order.standingOrderId = this.orderListService.order.standingOrderId;
        console.log(this.order);
        this.orderListService.editOrder(this.order).subscribe(
          (data) => {
            console.log(this.order);
            console.log(this.orderListService.order);
            this.orderListService.orders.splice(
              this.orderListService.orders.indexOf(this.orderListService.order),
              1,
              this.order
            );
            this.notificationService.success(':: Úspešne editované');
            this.orderListService.resetAndInitialize();
            this.dialogDetailRef.close();
          },
          (Error) => {
            alert(Error);
          }
        );
      }
    }
  }
}
