import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder } from './order';
import { tap, catchError } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderListService {
  private productUrl = 'http://127.0.0.1:8080/';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.productUrl + 'standingOrder').pipe(
      tap((data) => console.log('All: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }
}
