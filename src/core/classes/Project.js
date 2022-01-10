import IdList from './IdList';
import TaskList from './TaskList';
import OrderedIdList from './OrderedIdList';
import Label from './Label';
import { DEFAULT_COLORS } from '../constants';
import uuid from '../../utils/id';
import { copyObject } from '../../utils/misc';
import { converter } from '../../utils/firestore';

export default class Project {
  constructor({ name, id, totalTasks, labels, lists, position }) {
    this.name = name;
    this.id = id || uuid();
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
        project: this.id,
      }),
    ];

    this.labels = new IdList(labels || defaultLabels);
    this.lists = new OrderedIdList(lists || defaultLists);
    this.totalTasks =
      totalTasks || this.lists.items.flatMap((list) => list.items).length || 0;
  }

  static converter(source = {}) {
    return converter(Project, (data) => ({
      ...data,
      labels: source.labels?.filter((label) => label.project === data.id),
      lists: source.lists?.filter((list) => list.project === data.id),
    }));
  }

  toFirestore() {
    return copyObject(this, ['labels', 'lists']);
  }

  get link() {
    return `p/${this.id}`;
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
