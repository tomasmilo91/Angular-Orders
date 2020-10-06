import { IOrder } from './../../model/order';
import { Constants } from './../../shared/constants';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class OrderListService {
  /* Variable for order detail */
  orderDetail: IOrder;
  orders: IOrder[] = [];
  /* Variable for identify if add or edit order is clicked  */
  forCreate: boolean;

  /* Http request headers  */
  myHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  /* events for communicating for total sum  */
  private totalSumSource = new BehaviorSubject<any>(false);
  totalSumSubject = this.totalSumSource.asObservable();

  /* events for communicating for constant symbol  */
  private constantSymbolSource = new BehaviorSubject<any>(false);
  constantSymbolSubject = this.constantSymbolSource.asObservable();

  /* events for resetting form  */
  private resetSource = new BehaviorSubject<any>(false);
  resetSubject = this.resetSource.asObservable();

  /* events for initializating form with order  */
  private initializeFormGroupWithOrderSource = new BehaviorSubject<any>(false);
  initializeFormGroupWithOrderSubject = this.initializeFormGroupWithOrderSource.asObservable();

  constructor(private http: HttpClient) {}

  callEmitTotalSum(value: any): void {
    this.totalSumSource.next(value);
  }

  callEmitConstantSymbol(value: any): void {
    this.constantSymbolSource.next(value);
  }

  callEmitReset(value: any): void {
    this.resetSource.next(value);
  }

  callEmitinitializeFormGroupWithOrder(value: any): void {
    this.initializeFormGroupWithOrderSource.next(value);
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

  /* Calling GET order endpoint  */
  getOrder(orderId: number): Observable<IOrder> {
    return this.http
      .get<IOrder>(Constants.URL_GET_ONE + orderId, this.myHttpOptions)
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
}
