import { ConfirmationComponent } from './../../confirmation/confirmation.component';
import { OrderDetailComponent } from './../order-detail/order-detail.component';
import { OrderListService } from './order-list.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/internal/operators';
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
  changeText: boolean;

  dialogConfirmRef: MatDialogRef<ConfirmationComponent>;

  constructor(
    public orderListService: OrderListService,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.changeText = false;
  }

  /* Get all orders after initialization  */
  ngOnInit(): void {
    console.log('In OnInit');
    this.orderListService
      .getOrders()
      .pipe(map((orders) => (this.orderListService.orders = orders)))
      .subscribe();
  }

  /* Returns total amount of standing orders */
  getTotalAmount(): number {
    return this.orderListService.orders
      .map((t) => t.amount)
      .reduce((acc, value) => acc + value, 0);
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
    this.orderListService.resetAndInitialize();
    this.orderListService.forCreate = true;
  }

  /* Open dialog and initialize when edit order button is pressed  */
  onEdit(order: IOrder): void {
    this.openDialog();
    this.orderListService.form.reset();
    this.orderListService.form.markAllAsTouched();
    this.orderListService.initializeFormGroupWithOrder(order);
    this.orderListService.forCreate = false;
    this.orderListService.order = order;
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
        this.orderListService.deleteOrder(ord.standingOrderId).subscribe(
          (data) => {
            this.orderListService.orders.splice(
              this.orderListService.orders.indexOf(ord),
              1
            );
            console.log('Order deleted:' + ord);
            this.notificationService.success(':: Úspešne zmazané');
          },
          (Error) => {
            alert(Error);
          }
        );
      }
      this.dialogConfirmRef = null;
    });
  }
}
