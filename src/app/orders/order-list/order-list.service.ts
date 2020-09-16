import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder } from '../order';
import { tap, catchError } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderListService {
  private productUrl = '/api/';

  myHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  constructor(private http: HttpClient) {}

  getOrders(): Observable<IOrder[]> {
    return this.http
      .get<IOrder[]>(this.productUrl + 'standingOrder', this.myHttpOptions)
      .pipe(
        tap((data) => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }
}
