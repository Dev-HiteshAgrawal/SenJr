import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  getDocs,
  startAfter
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * A robust, generic hook to fetch data from Firestore with loading, error, and empty states.
 * Supports realtime listeners (onSnapshot) or one-time fetches.
 * 
 * @param {string} collectionName - The Firestore collection to query
 * @param {Object} options - Configuration options
 * @param {Array} options.filters - Array of where clauses e.g. [['role', '==', 'mentor'], ['status', '==', 'verified']]
 * @param {Array} options.sort - Order by clause e.g. ['createdAt', 'desc']
 * @param {number} options.limitCount - Max records to fetch
 * @param {boolean} options.realtime - Use onSnapshot instead of getDocs
 * @param {boolean} options.enabled - Whether the query should execute (useful for waiting on auth)
 */
export const useFirestoreQuery = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const {
    filters = [],
    sort = null,
    limitCount = 50,
    realtime = false,
    enabled = true
  } = options;

  // Memoize dependency string to prevent infinite loops if arrays are passed inline
  const depString = JSON.stringify({ collectionName, filters, sort, limitCount, realtime, enabled });

  useEffect(() => {
    if (!enabled || !collectionName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const colRef = collection(db, collectionName);
      const queryConstraints = [];

      // Add where clauses
      if (filters && filters.length > 0) {
        filters.forEach(f => {
          if (f && f.length === 3) {
            queryConstraints.push(where(f[0], f[1], f[2]));
          }
        });
      }

      // Add orderBy
      if (sort && sort.length >= 1) {
        queryConstraints.push(orderBy(sort[0], sort[1] || 'asc'));
      }

      // Add limit
      if (limitCount) {
        queryConstraints.push(limit(limitCount));
      }

      const finalQuery = query(colRef, ...queryConstraints);

      if (realtime) {
        // Realtime listener
        const unsubscribe = onSnapshot(finalQuery, (snapshot) => {
          const results = [];
          snapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
          });
          setData(results);
          if (snapshot.docs.length > 0) {
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            setHasMore(snapshot.docs.length === limitCount);
          } else {
            setHasMore(false);
          }
          setLoading(false);
        }, (err) => {
          console.error(`[useFirestoreQuery] Realtime Error in ${collectionName}:`, err);
          setError(err.message);
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        // One-time fetch
        const fetchData = async () => {
          try {
            const snapshot = await getDocs(finalQuery);
            const results = [];
            snapshot.forEach((doc) => {
              results.push({ id: doc.id, ...doc.data() });
            });
            setData(results);
            if (snapshot.docs.length > 0) {
              setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
              setHasMore(snapshot.docs.length === limitCount);
            } else {
              setHasMore(false);
            }
            setLoading(false);
          } catch (err) {
            console.error(`[useFirestoreQuery] Fetch Error in ${collectionName}:`, err);
            setError(err.message);
            setLoading(false);
          }
        };
        fetchData();
      }
    } catch (err) {
      console.error(`[useFirestoreQuery] Setup Error in ${collectionName}:`, err);
      setError(err.message);
      setLoading(false);
    }
  }, [depString]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, hasMore, lastVisible };
};
