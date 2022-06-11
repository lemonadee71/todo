import Core from '../core';
import { LocalStorage } from '../core/storage';
import { isGuest } from './auth';
import { getUserRef, updateUser } from './firestore';

export const syncTheme = async (theme) => {
  if (isGuest()) {
    LocalStorage.store('theme', theme);
  } else {
    // we're syncing the theme but we're currently not reading it
    await updateUser(Core.state.currentUser, { theme });
  }
};

// this currently syncs theme for app/* pages only
export const initializeTheme = async () => {
  let themeStoredOnline;
  if (!isGuest()) {
    const doc = await getUserRef(Core.state.currentUser);
    themeStoredOnline = doc.data()?.theme;
  }

  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  Core.state.darkTheme =
    // respect the user's preference
    window.matchMedia('(prefers-color-scheme: dark)').matches ||
    themeStoredOnline === 'dark' ||
    LocalStorage.get('theme') === 'dark';
};

export const toggleDarkTheme = () => {
  Core.state.darkTheme = !Core.state.darkTheme;
  const theme = Core.state.darkTheme ? 'dark' : 'light';

  syncTheme(theme);

  return theme;
};
