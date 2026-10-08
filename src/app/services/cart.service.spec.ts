import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    TestBed.resetTestingModule();
    service = TestBed.inject(CartService);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('should start with an empty cart', () => {
    expect(service.items()).toEqual([]);
    expect(service.itemCount()).toBe(0);
    expect(service.subtotal()).toBe(0);
  });

  it('should add a cart item with a computed subtotal', () => {
    service.add({
      productId: 'p1',
      productName: 'House Latte',
      imageUrl: 'latte.png',
      size: 'medium',
      sugar: 'Regular',
      quantity: 2,
      unitPrice: 130,
    });

    expect(service.items().length).toBe(1);
    expect(service.items()[0].subtotal).toBe(260);
    expect(service.itemCount()).toBe(2);
    expect(service.subtotal()).toBe(260);
  });

  it('should merge items with the same product, size and sugar', () => {
    const item = {
      productId: 'p1',
      productName: 'House Latte',
      imageUrl: 'latte.png',
      size: 'small' as const,
      sugar: 'Less Sugar',
      quantity: 1,
      unitPrice: 100,
    };

    service.add(item);
    service.add(item);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.items()[0].subtotal).toBe(200);
    expect(service.itemCount()).toBe(2);
  });

  it('should keep different size or sugar selections separate', () => {
    service.add({
      productId: 'p1',
      productName: 'House Latte',
      imageUrl: '',
      size: 'small',
      sugar: 'Regular',
      quantity: 1,
      unitPrice: 100,
    });
    service.add({
      productId: 'p1',
      productName: 'House Latte',
      imageUrl: '',
      size: 'large',
      sugar: 'Regular',
      quantity: 1,
      unitPrice: 160,
    });

    expect(service.items().length).toBe(2);
    expect(service.subtotal()).toBe(260);
  });

  it('should clear the cart', () => {
    service.add({
      productId: 'p1',
      productName: 'House Latte',
      imageUrl: '',
      size: 'small',
      sugar: 'No Sugar',
      quantity: 1,
      unitPrice: 100,
    });

    service.clear();

    expect(service.items()).toEqual([]);
    expect(service.itemCount()).toBe(0);
  });
});
