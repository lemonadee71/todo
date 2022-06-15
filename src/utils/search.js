import {
  isPast,
  isThisMonth,
  isThisQuarter,
  isThisWeek,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
} from 'date-fns';
import { compareTwoStrings } from 'string-similarity';
import { parseDate } from './date';

const SIMILARITY_THRESHOLD = 0.4;
const DATE_MAP = {
  due: 'dueDate',
  created: 'createdDate',
  updated: 'lastUpdate',
  completed: 'completionDate',
};
const DATE_FN_MAP = {
  // is past means overdue for due date
  past: (date) => isPast(date),
  yesterday: (date) => isYesterday(date),
  day: (date) => isToday(date),
  today: (date) => isToday(date),
  tomorrow: (date) => isTomorrow(date),
  week: (date) => isThisWeek(date),
  month: (date) => isThisMonth(date),
  quarter: (date) => isThisQuarter(date),
  year: (date) => isThisYear(date),
};

const evaluate = (task, { keyword, value }) => {
  switch (keyword) {
    case 'label':
      return +task.data.labels
        .map((label) => label.name)
        .map((name) => compareTwoStrings(name, value))
        .some((n) => n > SIMILARITY_THRESHOLD);

    // dates
    case 'due':
    case 'created':
    case 'update':
    case 'completed': {
      const val = value.toLowerCase();
      // no numbers for now
      if (!(val in DATE_FN_MAP)) return 0;

      const date = task[DATE_MAP[keyword]];

      return date ? +DATE_FN_MAP[val](parseDate(date)) : 0;
    }
    case 'has': {
      const data = task.data[value];
      return +!!(Array.isArray(data) ? data.length : data);
    }
    case 'title':
      // case sensitive comparison
      return compareTwoStrings(task.title, value);
    default:
      return 0;
  }
};

export const matches = (queryString, task, mode = 'AND') => {
  const results = queryString
    .split(',')
    .map((frag) => frag.trim())
    .map((frag) => {
      const [keyword, value] = frag.split(':').map((str) => str.trim());

      if (keyword && !value) {
        // if it starts with #, it's label
        if (keyword.startsWith('#'))
          return { keyword: 'label', value: keyword.replace('#', '') };

        // if no value and colon but has keyword, we assume it's the title
        if (!frag.includes(':')) return { keyword: 'title', value: keyword };
      }
      // preserve case for value
      return { keyword: keyword.toLowerCase(), value };
    })
    .map((data) => evaluate(task, data));

  let isAMatch;
  if (mode === 'AND') {
    isAMatch = results.every((n) => n > SIMILARITY_THRESHOLD);
  } else {
    isAMatch = results.some((n) => n > SIMILARITY_THRESHOLD);
  }

  // we compute the score to determine best match
  const score =
    results.reduce((acc, curr) => acc + curr) / results.length >
    SIMILARITY_THRESHOLD;

  return isAMatch ? score : 0;
};
