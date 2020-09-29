export interface IOrder {
  standingOrderId: number;
  accountId: number;
  accountNumber: string;
  amount: number;
  constantSymbol: string;
  interval: number;
  intervalSpecification: number;
  name: string;
  note: string;
  specificSymbol: number;
  validFrom: Date;
  variableSymbol: number;
}
