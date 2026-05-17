import { useState } from 'react'
import { uploadFile, getFileURL, deleteFile } from '../firebase/storage'

export const useStorage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const upload = async (file, path) => {
    try {
      setLoading(true)
      const url = await uploadFile(file, path)
      return url
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getURL = async (path) => {
    try {
      setLoading(true)
      const url = await getFileURL(path)
      return url
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const remove = async (path) => {
    try {
      setLoading(true)
      await deleteFile(path)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { upload, getURL, remove, loading, error }
}