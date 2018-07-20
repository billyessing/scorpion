export class Trade {
  constructor (
    public id: string,
    public type: string,
    public code: string,
    public quantity: number,
    public price?: number
  ) {}
}
