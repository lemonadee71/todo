import { getAuth } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

const path = (type) => `${getAuth().currentUser.uid}/${type}/items`;

export const converter = (base, resolver) => ({
  toFirestore: (data) => data.toFirestore(),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new base(resolver ? resolver(data) : data); // eslint-disable-line
  },
});

export const getData = (document) => document.data();

export const getDocuments = async (ref) => {
  const docs = await getDocs(ref);
  return docs?.docs?.map(getData);
};

export const getDocumentRef = (type, id, converterFn) =>
  doc(getFirestore(), path(type), id).withConverter(converterFn);

export const getCollectionRef = (type, converterFn) =>
  collection(getFirestore(), path(type)).withConverter(converterFn);

export const setDocument = (type, id, data, converterFn = null) =>
  setDoc(getDocumentRef(type, id, converterFn), data);

export const updateDocument = (type, id, data) =>
  updateDoc(getDocumentRef(type, id), data);

export const deleteDocument = (type, id) => deleteDoc(getDocumentRef(type, id));
