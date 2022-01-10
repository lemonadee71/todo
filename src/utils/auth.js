import {
  signOut as signOutUser,
  getAuth,
  getAdditionalUserInfo,
} from 'firebase/auth';
import Core from '../core';
import { LOCAL_USER, PATHS } from '../core/constants';
import { initFirestore } from '../core/firestore';

export const isGuest = (id = Core.state.currentUser) => id === LOCAL_USER;

export const getUser = () => getAuth().currentUser;

export const isNewUser = () => {
  const credential = Core.state.currentUserCredential;

  if (!credential) return false;
  return getAdditionalUserInfo(credential).isNewUser;
};

export const signIn = async (id = LOCAL_USER) => {
  Core.state.currentUser = id;

  // populate firestore if first time user
  if (isNewUser()) await initFirestore();

  Core.router.navigate(PATHS.app, { title: 'Overview', replace: true });
};

export const signOut = () => {
  signOutUser(getAuth());
  Core.state.currentUser = null;
  Core.data.root.clear();
  Core.router.navigate(PATHS.home, { title: 'To Do List', replace: true });
};
