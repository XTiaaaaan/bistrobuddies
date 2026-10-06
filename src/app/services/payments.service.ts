import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  collection,
  doc,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../core/firebase/firebase';
import { collectionData$, docData$ } from '../core/firebase/firestore.helpers';
import { Payment, PaymentInput, PaymentStatus } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly db = inject(FIREBASE_FIRESTORE);

  private paymentsRef(): CollectionReference<DocumentData> {
    return collection(this.db, 'payments');
  }

  private paymentRef(paymentId: string): DocumentReference {
    return doc(this.db, 'payments', paymentId);
  }

  watchPayment(paymentId: string): Observable<Payment | null> {
    return docData$<Payment>(this.paymentRef(paymentId));
  }

  watchOrderPayments(orderId: string): Observable<Payment[]> {
    const paymentsQuery = query(
      this.paymentsRef(),
      where('orderId', '==', orderId)
    );
    return collectionData$<Payment>(paymentsQuery);
  }

  getPayment(paymentId: string): Promise<Payment | null> {
    return getDoc(this.paymentRef(paymentId)).then((snapshot) =>
      snapshot.exists() ? (snapshot.data() as Payment) : null
    );
  }

  createPayment(input: PaymentInput): Promise<string> {
    const newRef = doc(this.paymentsRef());
    return setDoc(newRef, {
      ...input,
      id: newRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).then(() => newRef.id);
  }

  updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus
  ): Promise<void> {
    return updateDoc(this.paymentRef(paymentId), {
      status,
      updatedAt: serverTimestamp(),
    });
  }
}
