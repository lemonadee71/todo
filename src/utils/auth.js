import { signOut as signOutUser, getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Core from '../core';
import { LOCAL_USER, PATHS } from '../constants';

export const isGuest = (id = Core.state.currentUser) => id === LOCAL_USER;

export const getUser = () => getAuth().currentUser;

export const isNewUser = async (id) => {
  const document = await getDoc(doc(getFirestore(), id, 'data'));

  return !document.exists();
};

export const signIn = (id = LOCAL_USER) => {
  Core.state.currentUser = id;
  Core.router.redirect(PATHS.dashboard.url, { title: PATHS.dashboard.title });
};

export const signOut = () => {
  signOutUser(getAuth());
  Core.clearData();
  Core.router.redirect(PATHS.home.url, { title: PATHS.home.title });
};

export const getProfilePicURL = () => {
  const user = isGuest() ? { photoURL: '', displayName: 'Guest' } : getUser();
  const url =
    user.photoURL ||
    `https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=100&name=${encodeURI(
      user.displayName
    )}`;

  return url;
};

export const getUserName = () => (isGuest() ? 'Guest' : getUser().displayName);
