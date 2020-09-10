import { OrderListComponent } from './orders/order-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'orders-list', component: OrderListComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' }, // TODO change to notFoundPage
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
