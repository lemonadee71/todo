import { signOut as signOutUser, getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Core from '../core';
import { LOCAL_USER, PATHS } from '../core/constants';

export const isGuest = (id = Core.state.currentUser) => id === LOCAL_USER;

export const getUser = () => getAuth().currentUser;

export const isNewUser = async (id) => {
  const document = await getDoc(doc(getFirestore(), id, 'data'));

  return !document.exists();
};

export const signIn = (id = LOCAL_USER) => {
  Core.state.currentUser = id;
  Core.router.navigate(PATHS.app, { title: 'Overview', replace: true });
};

export const signOut = () => {
  signOutUser(getAuth());
  Core.clearData();
  Core.router.navigate(PATHS.home, { title: 'To Do List', replace: true });
};
