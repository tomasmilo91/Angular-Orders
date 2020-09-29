import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OrderListService } from '../orders/order-list/order-list.service';

@Component({
  selector: 'app-constant-list',
  templateUrl: './constant-list.component.html',
  styleUrls: ['./constant-list.component.less'],
})
export class ConstantListComponent {
  constantSymbols = [
    {
      symbol: 1118,
      detail: 'Administratívne a iné poplatky a platby - vo vzťahu k ŠR',
    },
    {
      symbol: 1144,
      detail: 'Bežná záloha dane',
    },
    {
      symbol: 7948,
      detail: 'Blokové pokuty vyrubené daňovým úradom',
    },
    {
      symbol: 1548,
      detail: 'Dodatočné daňové priznanie',
    },
    {
      symbol: 6148,
      detail: 'Dodatočná platba z daňovej inšpekcie',
    },
    {
      symbol: 2148,
      detail: 'Dodatočne vyrubená daň',
    },
    {
      symbol: 1348,
      detail: 'Doúčtovanie daní za predchádzajúce zdaňovacie obdobie',
    },
    {
      symbol: 7548,
      detail: 'Exekučné náklady',
    },
    {
      symbol: 3718,
      detail: 'Nájomné za prenájom - vo vzťahu k ŠR',
    },
    {
      symbol: 2058,
      detail: 'Nákup cenných papierov (akcie, dlhopisy, zmenky)',
    },
    {
      symbol: 5348,
      detail: 'Nárok na odpočet dane',
    },
    {
      symbol: 5058,
      detail: 'Ostatné obchody s cennými papiermi',
    },
    {
      symbol: 4098,
      detail: 'Vyplácanie výnosov z cenných papierov ',
    },
  ];

  public confirmMessage: string;
  constructor(
    public dialogRef: MatDialogRef<ConstantListComponent>,
    public orderListService: OrderListService
  ) {}

  onSubmit(constantSymbol: number): void {
    this.orderListService.form.controls.constantSymbol.setValue(constantSymbol);
    this.dialogRef.close();
  }
}
