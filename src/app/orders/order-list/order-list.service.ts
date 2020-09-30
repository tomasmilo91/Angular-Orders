import { IOrder } from './../../model/order';
import { Constants } from './../../shared/constants';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/internal/operators';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class OrderListService {
  order: IOrder;
  orders: IOrder[] = [];
  /* Variable for identify if add or edit order is clicked  */
  forCreate: boolean;

  // interval
  interval = [[1], [2], [3]];
  intervalSpecification = [
    [], [], // for interval = 1
    [1, 2, 3, 4, 5, 6, 7], // for interval = 2
    [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] // for interval = 3
  ];

  /* Http request headers  */
  myHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  constructor(private http: HttpClient) {}

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
    this.form.markAllAsTouched();
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

  /* Calling GET all orders endpoint  */
  getOrders(): Observable<IOrder[]> {
    return this.http
      .get<IOrder[]>(Constants.URL_GET_ALL, this.myHttpOptions)
      .pipe(
        tap((data) => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  /* Calling POST add order endpoint  */
  addOrder(order: IOrder): Observable<IOrder> {
    return this.http
      .post<IOrder>(Constants.URL_ADD_ORDER, order, this.myHttpOptions)
      .pipe(
        tap((data) => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  /* Calling PUT edit order endpoint  */
  editOrder(order: IOrder): Observable<IOrder> {
    return this.http
      .put<IOrder>(Constants.URL_UPDATE_ORDER, order, this.myHttpOptions)
      .pipe(
        tap((data) => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  /* Calling DELETE order endpoint  */
  deleteOrder(id: number): Observable<{}> {
    return this.http
      .delete(Constants.URL_UPDATE_ORDER + id, this.myHttpOptions)
      .pipe(
        tap((data) => console.log('All: ' + data)),
        catchError(this.handleError)
      );
  }

  /* Method for handling error from backend service to serve it to frontend alert method */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('ERROR: ' + error.error);
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
