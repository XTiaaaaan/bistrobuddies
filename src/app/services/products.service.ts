import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../core/firebase/firebase';
import { collectionData$, docData$ } from '../core/firebase/firestore.helpers';
import { Product, ProductInput } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly db = inject(FIREBASE_FIRESTORE);

  private productsRef(): CollectionReference<DocumentData> {
    return collection(this.db, 'products');
  }

  private productRef(productId: string): DocumentReference {
    return doc(this.db, 'products', productId);
  }

  watchProducts(): Observable<Product[]> {
    const productsQuery = query(
      this.productsRef(),
      orderBy('createdAt', 'desc')
    );
    return collectionData$<Product>(productsQuery);
  }

  getProduct(productId: string): Promise<Product | null> {
    return getDoc(this.productRef(productId)).then((snapshot) =>
      snapshot.exists() ? (snapshot.data() as Product) : null
    );
  }

  watchProduct(productId: string): Observable<Product | null> {
    return docData$<Product>(this.productRef(productId));
  }

  createProduct(input: ProductInput): Promise<void> {
    const newRef = doc(this.productsRef());
    return setDoc(newRef, {
      ...input,
      id: newRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  updateProduct(productId: string, patch: Partial<Product>): Promise<void> {
    return updateDoc(this.productRef(productId), {
      ...patch,
      updatedAt: serverTimestamp(),
    });
  }

  deleteProduct(productId: string): Promise<void> {
    return deleteDoc(this.productRef(productId));
  }
}
