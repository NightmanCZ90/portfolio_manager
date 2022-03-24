export interface Portfolio {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  description: string;
  color: string;
  url: string;
  userId: number;
  pmId: number | null;
}
