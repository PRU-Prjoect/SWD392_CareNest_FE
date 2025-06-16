export interface Shop {
  account_id: number;
  name: string;
  description: string;
  status: string;
  array_working_day: string[];
}

export interface SubAddress {
  id: number;
  name: string;
  shop_id: number;
  phone: string;
  address_name: string;
  is_default: boolean;
}
