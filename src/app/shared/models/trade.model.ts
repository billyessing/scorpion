export class Trade {
  constructor (
    public type: string,
    public code: string,
    public quantity: number,
    public price?: number,
    public _id?: string
  ) {}
}
