import { signOut as signOutUser, getAuth } from 'firebase/auth';
import Core from '../core';
import { LOCAL_USER, PATHS } from '../core/constants';

export const isGuest = (id = Core.state.currentUser) => id === LOCAL_USER;

export const getUser = () => getAuth().currentUser;

export const signIn = (id = LOCAL_USER) => {
  Core.state.currentUser = id;
  Core.router.navigate(PATHS.app, { title: 'Overview', replace: true });
};

export const signOut = () => {
  signOutUser(getAuth());
  Core.state.currentUser = null;
  Core.router.navigate(PATHS.home, { title: 'To Do List', replace: true });
};
