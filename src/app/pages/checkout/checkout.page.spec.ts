import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { CartItemInput } from '../../models/cart.model';
import { OrderInput, OrderStatus } from '../../models/order.model';
import { PaymentMethod, PaymentStatus } from '../../models/payment.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { UsersService } from '../../services/users.service';
import { CheckoutPage } from './checkout.page';

function item(overrides: Partial<CartItemInput> = {}): CartItemInput {
  return {
    productId: 'p1',
    productName: 'House Latte',
    productImage: 'https://example.com/latte.png',
    size: 'small',
    sugar: 'Regular',
    quantity: 2,
    unitPrice: 100,
    ...overrides,
  };
}

describe('CheckoutPage', () => {
  function setup(
    items: CartItemInput[] = [item()],
    profile: unknown = null,
    createOrder: ReturnType<typeof vi.fn> = vi.fn(() => Promise.resolve('order-1'))
  ): {
    fixture: ComponentFixture<CheckoutPage>;
    component: CheckoutPage;
    cart: CartService;
    createOrder: ReturnType<typeof vi.fn>;
    navigate: ReturnType<typeof vi.fn>;
  } {
    TestBed.configureTestingModule({
      imports: [CheckoutPage],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            user$: of({ uid: 'u1', email: 'juan@example.com', displayName: 'Juan dela Cruz' }),
          },
        },
        { provide: UsersService, useValue: { getUser: () => Promise.resolve(profile) } },
        { provide: OrdersService, useValue: { createOrder } },
        {
          provide: ToastController,
          useValue: { create: () => Promise.resolve({ present: () => Promise.resolve() }) },
        },
      ],
    });

    const router = TestBed.inject(Router);
    const navigate = vi.fn(() => Promise.resolve(true));
    vi.spyOn(router, 'navigate').mockImplementation(navigate);

    const cart = TestBed.inject(CartService);
    items.forEach((entry) => cart.add(entry));

    const fixture = TestBed.createComponent(CheckoutPage);
    fixture.detectChanges();

    return { fixture, component: fixture.componentInstance, cart, createOrder, navigate };
  }

  function fillContact(component: CheckoutPage): void {
    component.setName({ detail: { value: 'Juan dela Cruz' } });
    component.setPhone({ detail: { value: '09171234567' } });
    component.setAddress({ detail: { value: '123 Rizal St, Manila' } });
  }

  afterEach(() => TestBed.resetTestingModule());

  it('should show an empty state when the cart has no items', () => {
    const { fixture, component } = setup([]);

    expect(component.isEmpty()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Your cart is empty');
  });

  it('should review the cart items with subtotal and total', () => {
    const { fixture, component } = setup([
      item({ quantity: 2, unitPrice: 100 }),
      item({ size: 'large', sugar: 'No Sugar', unitPrice: 160, quantity: 1 }),
    ]);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('House Latte');
    expect(element.textContent).toContain('small · Regular · x2');
    expect(element.textContent).toContain('₱200.00');
    expect(component.subtotal()).toBe(360);
    expect(component.total()).toBe(360 + component.deliveryFee);
    expect(element.textContent).toContain('₱360.00');
  });

  it('should show the delivery fee only when it is configured', () => {
    const { fixture, component } = setup();
    const element = fixture.nativeElement as HTMLElement;

    expect(component.deliveryFee).toBe(0);
    expect(element.textContent).not.toContain('Delivery fee');
  });

  it('should require name, phone and address before ordering', () => {
    const { component } = setup();

    component.name.set('');
    component.submitted.set(true);
    expect(component.canSubmit()).toBe(false);
    expect(component.missingName()).toBe(true);
    expect(component.missingPhone()).toBe(true);
    expect(component.missingAddress()).toBe(true);

    fillContact(component);
    expect(component.canSubmit()).toBe(true);
  });

  it('should create a COD order with purchase-time snapshots', async () => {
    const { component, cart, createOrder, navigate } = setup([
      item({ quantity: 2, unitPrice: 100 }),
    ]);

    fillContact(component);
    component.setComment({ detail: { value: 'Please ring the bell' } });
    component.setPaymentMethod({ detail: { value: PaymentMethod.COD } });
    await component.placeOrder();

    expect(createOrder).toHaveBeenCalledTimes(1);
    const input = createOrder.mock.calls[0][0] as OrderInput;

    expect(input.customerId).toBe('u1');
    expect(input.customerSnapshot).toEqual({
      uid: 'u1',
      name: 'Juan dela Cruz',
      email: 'juan@example.com',
      phone: '09171234567',
    });
    expect(input.addressSnapshot).toEqual({
      recipientName: 'Juan dela Cruz',
      phone: '09171234567',
      address: '123 Rizal St, Manila',
    });
    expect(input.items).toEqual([
      {
        productId: 'p1',
        productName: 'House Latte',
        imageUrl: 'https://example.com/latte.png',
        size: 'small',
        sugar: 'Regular',
        quantity: 2,
        unitPrice: 100,
        subtotal: 200,
      },
    ]);
    expect(input.subtotal).toBe(200);
    expect(input.deliveryFee).toBe(component.deliveryFee);
    expect(input.total).toBe(200 + component.deliveryFee);
    expect(input.customerComment).toBe('Please ring the bell');
    expect(input.paymentMethod).toBe(PaymentMethod.COD);
    expect(input.paymentStatus).toBe(PaymentStatus.PENDING);
    expect(input.orderStatus).toBe(OrderStatus.PENDING);

    expect(cart.items()).toEqual([]);
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should create an online payment order as pending as well', async () => {
    const { component, createOrder } = setup();

    fillContact(component);
    component.setPaymentMethod({ detail: { value: PaymentMethod.ONLINE } });
    await component.placeOrder();

    const input = createOrder.mock.calls[0][0] as OrderInput;
    expect(input.paymentMethod).toBe(PaymentMethod.ONLINE);
    expect(input.paymentStatus).toBe(PaymentStatus.PENDING);
    expect(input.orderStatus).toBe(OrderStatus.PENDING);
  });

  it('should store an empty comment when the customer leaves it blank', async () => {
    const { component, createOrder } = setup();

    fillContact(component);
    await component.placeOrder();

    const input = createOrder.mock.calls[0][0] as OrderInput;
    expect(input.customerComment).toBe('');
  });

  it('should keep the cart and show an error when order creation fails', async () => {
    const failing = vi.fn(() => Promise.reject(new Error('permission denied')));
    const { component, cart, navigate } = setup([item()], null, failing);

    fillContact(component);
    await component.placeOrder();

    expect(failing).toHaveBeenCalledTimes(1);
    expect(cart.items().length).toBe(1);
    expect(component.errorMessage()).toContain('could not place your order');
    expect(component.submitting()).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should not create an order while required fields are missing', async () => {
    const { component, createOrder } = setup();

    component.submitted.set(true);
    component.name.set('Juan dela Cruz');
    await component.placeOrder();

    expect(createOrder).not.toHaveBeenCalled();
    expect(component.errorMessage()).toBeNull();
  });

  it('should prefill the contact details from the customer profile', async () => {
    const { component, fixture } = setup([item()], {
      name: 'Juan dela Cruz',
      phone: '09171234567',
      address: '123 Rizal St, Manila',
    });

    await fixture.whenStable();

    expect(component.name()).toBe('Juan dela Cruz');
    expect(component.phone()).toBe('09171234567');
    expect(component.address()).toBe('123 Rizal St, Manila');
  });

  it('should not overwrite details the customer already typed', async () => {
    const { component, fixture } = setup([item()], {
      name: 'Profile Name',
      phone: '0999',
      address: 'Profile Address',
    });

    component.setPhone({ detail: { value: '09170000000' } });
    await fixture.whenStable();

    expect(component.phone()).toBe('09170000000');
    expect(component.name()).toBe('Juan dela Cruz');
    expect(component.address()).toBe('Profile Address');
  });
});
