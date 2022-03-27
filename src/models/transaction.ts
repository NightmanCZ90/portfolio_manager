export enum TransactionType {
  Buy = 'buy',
  Sell = 'sell',
  BuyToCover = 'buyToCover',
  SellShort = 'sellShort',
  DRIP = 'drip', // Dividends plus Reinvestments
  Dividends = 'dividends',
  Split = 'split',
}

export enum ExecutionType {
  FIFO = 'fifo', // First In First Out
  LIFO = 'lifo', // Last In First Out
  WeightedAverage = 'weightedAverage',
  SpecificLots = 'specificLots',
  HighCost = 'highCost',
  LowCost = 'lowCost',
}

export interface BaseTransaction {
  stockName: string;
  stockSector: string;
  transactionTime: string;
  transactionType: TransactionType;
  numShares: number;
  price: number;
  currency: string;
  execution: ExecutionType;
  commissions: number;
  notes: string;
  userId?: number;
  portfolioId: number;
}
export interface Transaction extends BaseTransaction {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}
