export interface BasePortfolio {
  name: string;
  description: string;
  color: string;
  url: string;
  userId?: number;
  pmId?: number | null;
}

export interface Portfolio extends BasePortfolio {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}
