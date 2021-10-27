import uuid from '../../utils/id';
import IdList from './IdList';
import TaskList from './TaskList';
import OrderedIdList from './OrderedIdList';
import Label from './Label';
import { DEFAULT_COLORS } from '../constants';

export default class Project {
  constructor({ name, id, totalTasks, labels, lists, position }) {
    this.name = name;
    this.id = id || `project-${uuid(8)}`;
    this.labels = new IdList(
      labels || [
        // default labels
        new Label('Urgent', DEFAULT_COLORS[2]),
        new Label('Important', DEFAULT_COLORS[3]),
      ]
    );
    this.lists = new OrderedIdList(
      lists || [
        new TaskList({ name: 'Default', id: 'default', project: this.id }),
      ]
    );
    this.totalTasks =
      totalTasks || this.lists.items.flatMap((list) => list.items).length || 0;
    this.position = position;
  }

  get link() {
    return `p/${this.id.split('-')[1]}`;
  }

  getLabel(labelFilter) {
    return this.labels.get(labelFilter);
  }

  getList(listFilter) {
    return this.lists.get(listFilter);
  }
}
