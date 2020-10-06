import { ConstantListComponent } from './../../constant-list/constant-list.component';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderListService } from '../order-list/order-list.service';
import { NotificationService } from '../notification.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { IOrder } from 'src/app/model/order';
import { takeUntil, tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.less'],
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  order: IOrder;

  private readonly destroy$ = new Subject();

  minDate: Date;
  maxDate: Date;

  /* Initialize form validations  */
  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    accountNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}'
      ),
    ]),
    amount: new FormControl('', [
      Validators.required,
      Validators.pattern('\\-?\\d*\\.?\\d{1,2}'),
    ]),
    constantSymbol: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    variableSymbol: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    specificSymbol: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    note: new FormControl(''),
    interval: new FormControl(false, [Validators.required]),
    intervalSpecification: new FormControl(['']),
    validFrom: new FormControl(false, [Validators.required]),
  });

  /* Initialize form when dialog is loaded  */
  initializeFormGroup(): void {
    this.form.setValue({
      $key: null,
      name: '',
      accountNumber: '',
      amount: '',
      constantSymbol: '',
      variableSymbol: '',
      specificSymbol: '',
      note: '',
      interval: '',
      intervalSpecification: '',
      validFrom: '',
    });
  }

  /* Reset dialog attributes  */
  resetAndInitialize(): void {
    this.form.reset();
    this.initializeFormGroup();
  }

  /* Initialize form with order attributes when dialog is loaded (used in editing) */
  initializeFormGroupWithOrder(order: IOrder): void {
    this.form.setValue({
      $key: null,
      name: order.name,
      accountNumber: order.accountNumber,
      amount: order.amount,
      constantSymbol: order.constantSymbol,
      variableSymbol: order.variableSymbol,
      specificSymbol: order.specificSymbol,
      note: order.note,
      interval: order.interval,
      intervalSpecification: order.intervalSpecification,
      validFrom: order.validFrom,
    });
  }

  constructor(
    private ngZone: NgZone,
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.orderListService.constantSymbolSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          console.log('constant symbol has been subscribed: ' + value);
          this.form.get('constantSymbol').setValue(value);
          this.orderListService.callEmitConstantSymbol(false);
        }
      });
    this.orderListService.resetSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          console.log('reset has been subscribed: ' + value);
          this.resetAndInitialize();
          this.orderListService.callEmitReset(false);
        }
      });
    this.orderListService.initializeFormGroupWithOrderSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          console.log(
            'initialize group with order has been subscribed: ' + value
          );
          this.initializeFormGroupWithOrder(value);
          this.orderListService.callEmitinitializeFormGroupWithOrder(false);
        }
      });
  }

  onBack(): void {
    this.router.navigate(['/orders']);
  }

  onClear(): void {
    this.resetAndInitialize();
    this.notificationService.success(':: Úspešne vymazaný formulár');
  }

  onClose(): void {
    this.resetAndInitialize();
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
    if (this.form.valid) {
      this.order = this.form.value;
      // workaround because we dont use accountId but backend service require some value
      this.order.accountId = 1;
      // workaround because if interval == 1, intervalSpecification = null but backend service require some value
      if (this.order.interval === 1) {
        this.order.intervalSpecification = 1;
      }

      // call post method
      if (this.orderListService.forCreate === true) {
        console.log(this.order);
        this.orderListService
          .addOrder(this.order)
          .pipe(
            tap(
              () => {
                this.orderListService.callEmitTotalSum(true);
                this.notificationService.success(':: Úspešne vložené');
                this.resetAndInitialize();
                this.dialogDetailRef.close();
              },
              (Error) => {
                alert(Error);
              }
            )
          )
          .subscribe();
        // call put method
      } else {
        this.order.standingOrderId = this.orderListService.orderDetail.standingOrderId;
        console.log(this.order);
        this.orderListService
          .editOrder(this.order)
          .pipe(
            tap(
              () => {
                console.log(this.order);
                console.log(this.orderListService.orderDetail);
                this.orderListService.callEmitTotalSum(true);
                this.notificationService.success(':: Úspešne editované');
                this.resetAndInitialize();
                this.dialogDetailRef.close();
              },
              (Error) => {
                alert(Error);
              }
            )
          )
          .subscribe();
      }
    }
  }
}
