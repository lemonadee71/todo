import { getDocs } from 'firebase/firestore';
import Core from '../core';

export const path = (type) => `${Core.state.currentUser}/${type}/items`;

export const fetchFromIds = (ids, source) =>
  ids.map((id) => source.find((item) => item.id === id));

export const converter = (base, resolver) => ({
  toFirestore: (data) => data.toFirestore(),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new base(resolver ? resolver(data) : data); // eslint-disable-line
  },
});

export const normalizeData = (doc) => doc.data();

export const getDocuments = async (ref) => getDocs(ref).docs.map(normalizeData);
