import { useState, useEffect } from 'react'
import {
  createDocument,
  getDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  subscribeToDocument,
  subscribeToCollection,
  whereClause,
  orderByClause,
  limitClause
} from '../firebase/firestore'

export const useFirestore = (collectionName) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const create = async (data) => {
    try {
      return await createDocument(collectionName, data)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const get = async (docId) => {
    try {
      return await getDocument(collectionName, docId)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const getAll = async (constraints = []) => {
    try {
      setLoading(true)
      const result = await getDocuments(collectionName, constraints)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const update = async (docId, data) => {
    try {
      return await updateDocument(collectionName, docId, data)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const remove = async (docId) => {
    try {
      return await deleteDocument(collectionName, docId)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const subscribe = (docId, callback) => {
    return subscribeToDocument(collectionName, docId, callback)
  }

  const subscribeAll = (constraints, callback) => {
    return subscribeToCollection(collectionName, constraints, callback)
  }

  return {
    data,
    loading,
    error,
    create,
    get,
    getAll,
    update,
    remove,
    subscribe,
    subscribeAll,
    where: whereClause,
    orderBy: orderByClause,
    limit: limitClause
  }
}