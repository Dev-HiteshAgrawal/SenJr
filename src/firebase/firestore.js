import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore'
import { db } from './config'

export const createDocument = async (collectionName, data) => {
  return await addDoc(collection(db, collectionName), data)
}

export const getDocument = async (collectionName, docId) => {
  const docSnap = await getDoc(doc(db, collectionName, docId))
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export const getDocuments = async (collectionName, constraints = []) => {
  const q = query(collection(db, collectionName), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const updateDocument = async (collectionName, docId, data) => {
  return await updateDoc(doc(db, collectionName, docId), data)
}

export const deleteDocument = async (collectionName, docId) => {
  return await deleteDoc(doc(db, collectionName, docId))
}

export const subscribeToDocument = (collectionName, docId, callback) => {
  return onSnapshot(doc(db, collectionName, docId), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() })
    } else {
      callback(null)
    }
  })
}

export const subscribeToCollection = (collectionName, constraints, callback) => {
  return onSnapshot(query(collection(db, collectionName), ...constraints), (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(docs)
  })
}

export const whereClause = where
export const orderByClause = orderBy
export const limitClause = limit
export const collectionRef = collection