export interface BasePortfolio {
  name: string;
  description: string | null;
  color: string | null;
  url: string | null;
  userId: number;
  pmId: number | null;
}
