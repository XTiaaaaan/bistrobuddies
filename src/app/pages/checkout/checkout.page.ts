import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cafe, cart } from 'ionicons/icons';
import { environment } from '../../../environments/environment';
import { CartItem } from '../../models/cart.model';
import { OrderInput, OrderItem, OrderStatus } from '../../models/order.model';
import { PaymentMethod, PaymentStatus } from '../../models/payment.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { UsersService } from '../../services/users.service';

type InputEventLike = { detail: { value?: unknown } };

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonRadio,
    IonRadioGroup,
    IonTextarea,
    IonTitle,
    IonToolbar,
    RouterLink,
  ],
})
export class CheckoutPage implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = this.cartService.items;
  readonly subtotal = this.cartService.subtotal;
  readonly deliveryFee = environment.deliveryFee > 0 ? environment.deliveryFee : 0;
  readonly paymentMethods = [
    { value: PaymentMethod.COD, label: 'COD', hint: 'Pay cash when your order arrives.' },
    {
      value: PaymentMethod.ONLINE,
      label: 'Online Payment',
      hint: 'Pay securely online after placing the order.',
    },
  ];

  readonly name = signal('');
  readonly phone = signal('');
  readonly address = signal('');
  readonly comment = signal('');
  readonly paymentMethod = signal<PaymentMethod>(PaymentMethod.COD);
  readonly uid = signal<string | null>(null);
  readonly email = signal('');
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly isEmpty = computed(() => this.items().length === 0);
  readonly missingName = computed(() => this.name().trim() === '');
  readonly missingPhone = computed(() => this.phone().trim() === '');
  readonly missingAddress = computed(() => this.address().trim() === '');
  readonly total = computed(() => this.subtotal() + this.deliveryFee);

  readonly canSubmit = computed(
    () =>
      !this.isEmpty() &&
      !this.submitting() &&
      !this.missingName() &&
      !this.missingPhone() &&
      !this.missingAddress() &&
      this.uid() !== null
  );

  constructor() {
    addIcons({ cafe, cart });
  }

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.uid.set(user?.uid ?? null);
        this.email.set(user?.email ?? '');
        if (user) {
          void this.prefill(user.uid, user.displayName ?? '');
        }
      });
  }

  async prefill(uid: string, displayName: string): Promise<void> {
    if (!this.name().trim() && displayName.trim()) {
      this.name.set(displayName.trim());
    }

    try {
      const profile = await this.usersService.getUser(uid);
      if (!profile) {
        return;
      }
      if (!this.name().trim()) {
        this.name.set(profile.name ?? '');
      }
      if (!this.phone().trim()) {
        this.phone.set(profile.phone ?? '');
      }
      if (!this.address().trim()) {
        this.address.set(profile.address ?? '');
      }
    } catch {
      // Profile details are optional; the customer can type them manually.
    }
  }

  setName(event: InputEventLike): void {
    this.name.set(asText(event));
  }

  setPhone(event: InputEventLike): void {
    this.phone.set(asText(event));
  }

  setAddress(event: InputEventLike): void {
    this.address.set(asText(event));
  }

  setComment(event: InputEventLike): void {
    this.comment.set(asText(event));
  }

  setPaymentMethod(event: InputEventLike): void {
    const value = event.detail.value;
    if (value === PaymentMethod.COD || value === PaymentMethod.ONLINE) {
      this.paymentMethod.set(value);
    }
  }

  async placeOrder(): Promise<string | void> {
    this.submitted.set(true);
    this.errorMessage.set(null);

    if (!this.canSubmit()) {
      return;
    }

    const uid = this.uid();
    if (!uid) {
      return;
    }

    this.submitting.set(true);
    try {
      const input = this.buildOrderInput(uid);
      const orderId = await this.ordersService.createOrder(input);
      this.cartService.clear();

      const toast = await this.toastController.create({
        message: 'Your order has been placed.',
        duration: 2500,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();
      await this.router.navigate(['/dashboard']);
      return orderId;
    } catch {
      this.errorMessage.set('We could not place your order. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }

  buildOrderInput(customerId: string): OrderInput {
    const name = this.name().trim();
    const phone = this.phone().trim();
    const address = this.address().trim();
    const subtotal = this.subtotal();
    const deliveryFee = this.deliveryFee;

    return {
      customerId,
      customerSnapshot: {
        uid: customerId,
        name,
        email: this.email(),
        phone,
      },
      addressSnapshot: {
        recipientName: name,
        phone,
        address,
      },
      items: this.items().map((item) => toOrderItem(item)),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      customerComment: this.comment().trim(),
      paymentMethod: this.paymentMethod(),
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
    };
  }

  formatPrice(value: number): string {
    return `₱${value.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function toOrderItem(item: CartItem): OrderItem {
  return {
    productId: item.productId,
    productName: item.productName,
    imageUrl: item.productImage,
    size: item.size,
    sugar: item.sugar,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.itemSubtotal,
  };
}

function asText(event: InputEventLike): string {
  const value = event.detail.value;
  return typeof value === 'string' ? value : '';
}
