import { ConstantListComponent } from './constant-list/constant-list.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './home/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { IntervalComponent } from './orders/interval/interval.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    OrderListComponent,
    OrderDetailComponent,
    ConfirmationComponent,
    ConstantListComponent,
    IntervalComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [IntervalComponent],
  bootstrap: [AppComponent],
  entryComponents: [OrderDetailComponent, ConfirmationComponent],
})
export class AppModule {}
