export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  createdDate: string;
  totalOrders: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: string;
  orderDate: string;
  items: number;
}