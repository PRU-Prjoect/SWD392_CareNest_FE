// types/customer.ts
export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  id_card?: string;
}