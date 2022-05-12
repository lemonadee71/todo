import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { addHooks } from 'poor-man-jsx';
import Core from '../core';
import { LocalStorage } from '../core/storage';
import { isGuest } from './auth';

export const syncTheme = async (theme) => {
  if (isGuest()) {
    LocalStorage.store('theme', theme);
  } else {
    // we're syncing the theme but we're currently not reading it
    await updateDoc(doc(getFirestore(), Core.state.currentUser, 'data'), {
      theme,
    });
  }
};

// this currently syncs theme for app/* pages only
export const initializeTheme = async () => {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  Core.state.darkTheme =
    LocalStorage.get('theme') === 'dark' &&
    // respect the user's preference
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  addHooks(document.documentElement, {
    class: Core.state.$darkTheme((value) => (value ? 'dark' : 'light')),
  });
};

export const toggleDarkTheme = () => {
  Core.state.darkTheme = !Core.state.darkTheme;
  const theme = Core.state.darkTheme ? 'dark' : 'light';

  syncTheme(theme);

  return theme;
};
