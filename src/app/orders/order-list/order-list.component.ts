import { IntervalComponent } from './../interval/interval.component';
import { ConfirmationComponent } from './../../confirmation/confirmation.component';
import { OrderDetailComponent } from './../order-detail/order-detail.component';
import { OrderListService } from './order-list.service';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { NotificationService } from '../notification.service';
import { IOrder } from 'src/app/model/order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less'],
})
export class OrderListComponent implements OnInit {
  dialogConfirmRef: MatDialogRef<ConfirmationComponent>;

  totalSum: number;

  constructor(
    public orderListService: OrderListService,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public intervalComponent: IntervalComponent
  ) {}

  /* Get all orders after initialization  */
  ngOnInit(): void {
    console.log('In OnInit');
    this.orderListService.totalSumSubject.subscribe(() => {
      this.fillAndUpdateOrderTable();
    });
  }

  fillAndUpdateOrderTable(): void {
    console.log('updating table');
    this.orderListService
      .getOrders()
      .pipe(
        tap((orders) => {
          this.orderListService.orders = orders;
          this.getTotalAmount();
        })
      )
      .subscribe();
  }

  /* Returns total amount of standing orders */
  getTotalAmount(): void {
    this.totalSum = this.orderListService.orders
      .map((t) => t.amount)
      .reduce((acc, value) => acc + value, 0);
    console.log('calculated sum:' + this.totalSum);
  }

  /* Returns length of standing orders arrays with respective text  */
  getSum(): string {
    let result = 'empty';
    const x = this.orderListService.orders.length;
    switch (true) {
      case x >= 5:
        result = ' trvalých príkazov';
        break;
      case x === 0:
        result = ' trvalých príkazov';
        break;
      case x === 1:
        result = ' trvalý príkaz';
        break;
      case x >= 2 && x <= 4:
        result = ' trvalé príkazy';
        break;
      default:
        break;
    }
    return x + result;
  }

  /* Open dialog winow for adding and editing orders  */
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '650px';
    this.dialog.open(OrderDetailComponent, dialogConfig);
  }

  /* Open dialog and initialize when add order button is pressed  */
  onCreate(): void {
    this.openDialog();
    this.orderListService.callEmitReset(true);
    this.orderListService.forCreate = true;
  }

  /* Open dialog and initialize when edit order button is pressed  */
  onEdit(order: IOrder): void {
    this.openDialog();
    // get order from database
    this.orderListService
      .getOrder(order.standingOrderId)
      .pipe(
        tap((orderFromBE) => {
          this.orderListService.orderDetail = orderFromBE;
          this.orderListService.callEmitinitializeFormGroupWithOrder(
            this.orderListService.orderDetail
          );
          this.orderListService.forCreate = false;
        })
      )
      .subscribe();
  }

  /* Delete order from database and table when delete order button is pressed  */
  onDelete(ord: IOrder): void {
    // dialog for confirmation
    this.dialogConfirmRef = this.dialog.open(ConfirmationComponent, {
      disableClose: false,
    });
    this.dialogConfirmRef.componentInstance.confirmMessage =
      'Skutočne chcete zmazať tento príkaz?';

    this.dialogConfirmRef.afterClosed().subscribe((result) => {
      if (result) {
        // dialog is confirmed
        console.log('deleting order' + ord);
        this.orderListService
          .deleteOrder(ord.standingOrderId)
          .pipe(
            tap(
              () => {
                console.log('Order deleted:' + ord);
                this.notificationService.success(':: Úspešne zmazané');
                this.fillAndUpdateOrderTable();
              },
              (Error) => {
                alert(Error);
              }
            )
          )
          .subscribe();
      }
      this.dialogConfirmRef = null;
    });
  }
}
