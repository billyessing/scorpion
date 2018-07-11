import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import * as firebase from 'firebase/app';

// Custom types
type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  // ***************
  // Firestore data is stored within a document --
  // a document is very similar to a JSON object it
  // contains fields that map to values.
  // Collections are basically just lists of documents.
  // Two important rules about documents and collections
  // 1. every document has to be contained within a collection
  // 2. you don't need to manage collections (done automatically)
  // ***************

  constructor(public afs: AngularFirestore) { }


  /// **************
  /// Get a Reference
  /// **************

  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref
  }


  /// **************
  /// Get Data
  /// **************

  // Return document
  // ex. this.db.doc$('notes/ID')
  doc$<T>(ref:  DocPredicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(map(doc => {
      return doc.payload.data() as T
    }))
  }

  // Return collection
  // ex. this.db.col$('notes', ref => ref.where('user', '==', 'Billos'))
  col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(map(docs => {
      return docs.map(a => a.payload.doc.data()) as T[]
    }));
  }

  // With Ids
  colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, data };
      });
    }));
  }


  /// **************
  /// Write Data
  /// **************

  get timestamp() {
      return firebase.firestore.FieldValue.serverTimestamp()
  }

  set<T>(ref: DocPredicate<T>, data: any) {
    const timestamp = this.timestamp
    return this.doc(ref).set({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    })
  }

  update<T>(ref: DocPredicate<T>, data: any) {
    return this.doc(ref).update({
      ...data,
      updatedAt: this.timestamp
    })
  }

  delete<T>(ref: DocPredicate<T>) {
    return this.doc(ref).delete()
  }

  add<T>(ref: CollectionPredicate<T>, data) {
    const timestamp = this.timestamp
    return this.col(ref).add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    })
  }

  // Very unnessary ... unless maybe I wanted to
  // track locations
  geopoint(lat: number, lng: number) {
    return new firebase.firestore.GeoPoint(lat, lng)
  }

  // If doc exists update, otherwise set
  // Easier to manage timestamps this way
  // upsert<T>(ref: DocPredicate<T>, data: any) {
  //   const doc = this.doc(ref).snapshotChanges().pipe(take(1).toPromise()
  //
  //   return doc.then(snap => {
  //     return snap.payload.exists ? this.update(ref, data) : this.set(ref, data)
  //   })
  // }


  /// **************
  /// Inspect Data
  /// **************

 // inspectDoc(ref: DocPredicate<any>): void {
 //   const tick = new Date().getTime()
 //   this.doc(ref).snapshotChanges()
 //       .take(1)
 //       .do(d => {
 //         const tock = new Date().getTime() - tick
 //         console.log(`Loaded Document in ${tock}ms`, d)
 //       })
 //       .subscribe()
 // }
 //
 //
 // inspectCol(ref: CollectionPredicate<any>): void {
 //   const tick = new Date().getTime()
 //   this.col(ref).snapshotChanges()
 //       .take(1)
 //       .do(c => {
 //         const tock = new Date().getTime() - tick
 //         console.log(`Loaded Collection in ${tock}ms`, c)
 //       })
 //       .subscribe()
 // }

  /// **************
  /// Create and read doc references
  /// **************

  /// create a reference between two documents
  connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) {
    return this.doc(host).update({ [key]: this.doc(doc).ref })
  }


  /// returns a documents references mapped to AngularFirestoreDocument
  docWithRefs$<T>(ref: DocPredicate<T>) {
    return this.doc$(ref).pipe(map(doc => {
      for (const k of Object.keys(doc)) {
        if (doc[k] instanceof firebase.firestore.DocumentReference) {
          doc[k] = this.doc(doc[k].path)
        }
      }
      return doc
    }))
  }

}
