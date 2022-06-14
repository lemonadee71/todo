import { DEFAULT_COLORS } from './constants';
import Label from './core/classes/Label';
import TaskList from './core/classes/TaskList';

export const defaultLabels = [
  new Label({ name: 'Urgent', color: DEFAULT_COLORS[2] }),
  new Label({ name: 'Important', color: DEFAULT_COLORS[3] }),
];
export const defaultLists = [new TaskList({ name: 'Default' })];
