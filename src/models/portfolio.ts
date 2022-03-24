export interface Portfolio {
  id?: number;
  name: string;
  description: string;
  color: string;
  url: string;
  userId: number;
  pmId: number | null;
}
