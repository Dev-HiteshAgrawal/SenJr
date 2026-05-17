import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

export const getFileURL = async (path) => {
  const storageRef = ref(storage, path)
  return await getDownloadURL(storageRef)
}

export const deleteFile = async (path) => {
  const storageRef = ref(storage, path)
  return await deleteObject(storageRef)
}