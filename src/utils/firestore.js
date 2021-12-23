import { collection, getDocs, getFirestore } from 'firebase/firestore';
import Core from '../core';

export const path = (type, ...segments) =>
  `${Core.state.currentUser}/${type}/items` + segments.length
    ? `/${segments.join('/')}`
    : '';

export const converter = (base, resolver) => ({
  toFirestore: (data) => data.toFirestore(),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new base(resolver ? resolver(data) : data); // eslint-disable-line
  },
});

export const normalizeData = (doc) => doc.data();

export const getDocuments = async (ref) => getDocs(ref).docs.map(normalizeData);

export const getCollection = (pathStr, converterFn) =>
  collection(getFirestore(), pathStr).withConverter(converterFn);
