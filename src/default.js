import { DEFAULT_COLORS } from './constants';
import Label from './core/classes/Label';
import TaskList from './core/classes/TaskList';

export const defaultLabels = [
  new Label({ name: 'Urgent', color: DEFAULT_COLORS.orange }),
  new Label({ name: 'Important', color: DEFAULT_COLORS.red }),
];
export const defaultLists = [new TaskList({ name: 'Default' })];
