import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const path = (type) => `${getAuth().currentUser.uid}/${type}/items`;

export const converter = (base, resolver) => ({
  toFirestore: (data) => data.toFirestore(),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new base(resolver ? resolver(data) : data); // eslint-disable-line
  },
});

export const getData = (doc) => doc.data();

export const getDocuments = async (ref) => {
  const docs = await getDocs(ref);
  return docs?.docs?.map(getData);
};

export const getCollection = (type, converterFn) =>
  collection(getFirestore(), path(type)).withConverter(converterFn);
