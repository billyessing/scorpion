export class Transaction {
  constructor (
    public id?: string,
    public type?: string,
    public code?: string,
    public quantity?: number,
    public timestamp?: string
  ) {}
}
