export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  badge?: string;
  tags?: string[];
  createdAt: number;
  isUserAdded?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameBn?: string;
  icon: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: 'cod' | 'bkash' | 'card';
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
  createdAt: number;
}

export type IssueCategory = 
  | 'damaged_item' 
  | 'delivery_delay' 
  | 'wrong_item' 
  | 'payment_issue' 
  | 'return_request' 
  | 'general_feedback';

export interface CustomerReportIssue {
  id: string;
  orderId?: string;
  customerName: string;
  contact: string;
  category: IssueCategory;
  subject: string;
  details: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'Under Review' | 'Resolved';
  createdAt: number;
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

export type Currency = 'BDT' | 'USD';
