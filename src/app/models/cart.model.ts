import { ProductSize } from './product.model';

export interface CartItem {
  productId: string;
  productName: string;
  imageUrl: string;
  size: ProductSize;
  sugar: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type CartItemInput = Omit<CartItem, 'subtotal'>;
