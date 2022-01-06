import format from 'date-fns/format';

export const template = {
  popupDetailDate: (...args) =>
    format(args[2].toDate(), 'MMMM d, yyyy hh:mm a'),
};
