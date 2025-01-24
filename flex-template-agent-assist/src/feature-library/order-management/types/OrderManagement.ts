export interface Customer {
  id: number;
  name: string;
  email: string;
  orders: Order[];
}

export interface Order {
  id: number;
  customerId: number;
  orderStatus: string;
  items: LineItem[];
}

export interface LineItem {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  totalCost: number;
}

export interface Item {
  itemId: number;
  name: string;
  cost: number;
}
