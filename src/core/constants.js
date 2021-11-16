export const GH_PATH = '/todo';
export const LOCAL_USER = '@@local';
export const ROOT_NAME = 'root';
export const LAST_UPDATE = 'lastUpdate';
export const LAST_OPENED_PAGE = 'lastOpenedPage';
export const PATHS = {
  home: '/',
  login: 'login',
  app: 'app',
  allApp: /app(.*)?/,
  calendar: 'app/calendar',
  project: 'app/p/:id',
  task: 'app/t/:id',
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
export const DEPENDENCY_COLORS = {
  blocked: DEFAULT_COLORS[3],
  related: DEFAULT_COLORS[5],
  duplicate: DEFAULT_COLORS[1],
};
export const DEPENDENCY_PREFIX = {
  blocked: 'Blocked by',
  related: 'Related to',
  duplicate: 'Duplicate of',
};
