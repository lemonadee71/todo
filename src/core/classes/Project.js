import uuid from '../../utils/id';
import IdList from './IdList';
import TaskList from './TaskList';
import OrderedIdList from './OrderedIdList';
import Label from './Label';
import { DEFAULT_COLORS } from '../constants';
import { copyObject } from '../../utils/misc';

export default class Project {
  constructor({ name, id, totalTasks, labels, lists, position }) {
    this.name = name;
    this.id = id || `project-${uuid(8)}`;
    this.position = position;

    const defaultLabels = [
      new Label({
        name: 'Urgent',
        color: DEFAULT_COLORS[2],
        project: this.id,
      }),
      new Label({
        name: 'Important',
        color: DEFAULT_COLORS[3],
        project: this.id,
      }),
    ];
    const defaultLists = [
      new TaskList({
        name: 'Default',
        id: 'default',
        project: this.id,
      }),
    ];

    this.labels = new IdList(labels || defaultLabels);
    this.lists = new OrderedIdList(lists || defaultLists);
    this.totalTasks =
      totalTasks || this.lists.items.flatMap((list) => list.items).length || 0;
  }

  get link() {
    return `p/${this.id.split('-')[1]}`;
  }

  toFirestore() {
    return copyObject(this, ['labels', 'lists']);
  }

  getLabel(labelFilter) {
    return this.labels.get(labelFilter);
  }

  addLabel(label) {
    label.project = this.id;

    return this.labels.add(label);
  }

  getList(listFilter) {
    return this.lists.get(listFilter);
  }

  addList(list) {
    list.project = this.id;

    return this.lists.add(list);
  }
}
