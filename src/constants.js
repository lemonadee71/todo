export const GH_PATH = '/todo';
export const LOCAL_USER = '@@local';
export const ROOT_NAME = 'root';
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
export const DEFAULT_COLORS = [
  '#61BD4F', // 0, green
  '#F2D600', // 1, yellow
  '#FF9F1A', // 2, orange
  '#EB5A46', // 3, red
  '#C377E0', // 4, purple
  '#0079BF', // 5, dark blue
  '#00C2E0', // 6, light blue
  '#51E898', // 7, light green
  '#FF78CB', // 8, pink
  '#344563', // 9, black
];
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
export const TZ_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssxxxxx";
export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm';
