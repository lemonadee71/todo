import { signOut as signOutUser, getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Core from '../core';
import { LOCAL_USER, PATHS } from '../constants';
import { getInitials } from './misc';

export const isGuest = (id = Core.state.currentUser) => id === LOCAL_USER;

export const getUser = () => getAuth().currentUser;

export const isNewUser = async (id) => {
  const document = await getDoc(doc(getFirestore(), id, 'data'));

  return !document.exists();
};

export const signIn = (id = LOCAL_USER) => {
  Core.state.currentUser = id;
  Core.router.redirect(PATHS.app, { title: 'Overview' });
};

export const signOut = () => {
  signOutUser(getAuth());
  Core.clearData();
  Core.router.redirect(PATHS.home, { title: 'To Do List' });
};

export const getProfilePicURL = () => {
  const user = isGuest() ? { photoURL: '', displayName: 'Guest' } : getUser();
  const url =
    user.photoURL ||
    `https://via.placeholder.com/60x60?text=${getInitials(user.displayName)}`;

  return url;
};

export const getUserName = () => (isGuest() ? 'Guest' : getUser().displayName);
