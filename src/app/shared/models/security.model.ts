export class Security {
  constructor (
    public code: string,
    public companyName: string,
    public industry: string,
    public purchasePrice: number,
    public lastPrice: number,
    public open: number,
    public high: number,
    public low: number,
    public volumeDaily: number,
    public volume: number,
    public value: number,
    public gain: number,
    public gainAsPercentage: number,
    public updatedAt: string
  ) { }
}
