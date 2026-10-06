import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  collection,
  doc,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../core/firebase/firebase';
import { collectionData$, docData$ } from '../core/firebase/firestore.helpers';
import { Order, OrderInput, OrderStatus } from '../models/order.model';
import { PaymentStatus } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly db = inject(FIREBASE_FIRESTORE);

  private ordersRef(): CollectionReference<DocumentData> {
    return collection(this.db, 'orders');
  }

  private orderRef(orderId: string): DocumentReference {
    return doc(this.db, 'orders', orderId);
  }

  watchOrders(): Observable<Order[]> {
    const ordersQuery = query(this.ordersRef(), orderBy('createdAt', 'desc'));
    return collectionData$<Order>(ordersQuery);
  }

  watchCustomerOrders(customerId: string): Observable<Order[]> {
    const ordersQuery = query(
      this.ordersRef(),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    return collectionData$<Order>(ordersQuery);
  }

  watchOrder(orderId: string): Observable<Order | null> {
    return docData$<Order>(this.orderRef(orderId));
  }

  getOrder(orderId: string): Promise<Order | null> {
    return getDoc(this.orderRef(orderId)).then((snapshot) =>
      snapshot.exists() ? (snapshot.data() as Order) : null
    );
  }

  createOrder(input: OrderInput): Promise<string> {
    const newRef = doc(this.ordersRef());
    return setDoc(newRef, {
      ...input,
      id: newRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).then(() => newRef.id);
  }

  updateOrderStatus(orderId: string, orderStatus: OrderStatus): Promise<void> {
    return updateDoc(this.orderRef(orderId), {
      orderStatus,
      updatedAt: serverTimestamp(),
    });
  }

  updateOrderPaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus
  ): Promise<void> {
    return updateDoc(this.orderRef(orderId), {
      paymentStatus,
      updatedAt: serverTimestamp(),
    });
  }
}
