export class Security {
  constructor (
    public code: string,
    public quantity: number,
    public price?: number,
    public _id?: string
  ) {}
}
