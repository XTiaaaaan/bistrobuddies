import { Injectable, computed, signal } from '@angular/core';
import { CartItem, CartItemInput } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>([]);

  readonly items = this.itemsSignal.asReadonly();
  readonly itemCount = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.quantity, 0)
  );
  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.subtotal, 0)
  );

  add(input: CartItemInput): void {
    const subtotal = input.unitPrice * input.quantity;

    this.itemsSignal.update((items) => {
      const index = items.findIndex(
        (item) =>
          item.productId === input.productId &&
          item.size === input.size &&
          item.sugar === input.sugar
      );

      if (index === -1) {
        return [...items, { ...input, subtotal }];
      }

      const updated = [...items];
      const existing = updated[index];
      const quantity = existing.quantity + input.quantity;
      updated[index] = { ...existing, quantity, subtotal: existing.unitPrice * quantity };
      return updated;
    });
  }

  clear(): void {
    this.itemsSignal.set([]);
  }
}
