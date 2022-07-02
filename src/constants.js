export const GH_PATH = '/todo';
export const LOCAL_USER = '@@local';
export const LAST_UPDATE = 'lastUpdate';
export const LAST_OPENED_PAGE = 'lastOpenedPage';
export const PATHS = {
  home: { url: '/', title: 'todo' },
  login: { url: 'login', title: 'Login' },
  app: { url: 'app/*', title: 'Home' },
  dashboard: { url: 'app', title: 'Dashboard' },
  project: { url: 'app/p/:id' },
  task: { url: 'app/t/:id' },
};
export const TZ_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssxxxxx";
export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm';
// All colors except blue have contrast errors (white text)
export const DEFAULT_COLORS = {
  green: '#61BD4F',
  'bright-green': '#9CD326',
  yellow: '#F2D600',
  orange: '#FF9F1A',
  red: '#EB5A46',
  blue: '#0079BF',
  olympic: '#008ECC',
  lilac: '#B660CD',
  'rose-pink': '#FF66CC',
  gray: '#48494B',
};
// copied from bootstrap toast colors
export const TOAST_COLORS = {
  primary: {
    background: '#cfe2ff',
    text: '#084298',
    border: '#b6d4fe',
  },
  secondary: {
    background: '#353535',
    text: 'white',
    border: 'gray',
  },
  success: {
    background: '#d1e7dd',
    text: '#0f5132',
    border: '#badbcc',
  },
  danger: {
    background: '#f8d7da',
    text: '#842029',
    border: '#f5c2c7',
  },
  warning: {
    background: '#fff3cd',
    text: '#664d03',
    border: '#ffecb5',
  },
  info: {
    background: '#cff4fc',
    text: '#055160',
    border: '#b6effb',
  },
};
export const SHOW_EVENTS = ['mouseenter', 'focus'];
export const HIDE_EVENTS = ['mouseleave', 'blur'];
export const POPPER_CONFIG = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    },
  ],
};
