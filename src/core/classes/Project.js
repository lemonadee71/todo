import IdList from './IdList';
import TaskList from './TaskList';
import Label from './Label';
import { DEFAULT_COLORS } from '../../constants';
import uuid from '../../utils/id';
import { copy, orderById } from '../../utils/misc';
import { converter } from '../../utils/firestore';

export default class Project {
  constructor({ name, id, lastFetched, labels, lists, __initialListsOrder }) {
    // meta
    this.name = name;
    this.id = id || uuid();
    this.lastFetched = lastFetched || Date.now();

    // firestore specific props
    // only set once on first fetched
    this.__initialListsOrder = __initialListsOrder ?? [];

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
    this.lists = new IdList(lists || defaultLists);
  }

  static converter(source = {}) {
    return converter(Project, (data) => ({
      ...data,
      labels: source.labels?.filter((label) => label.project === data.id),
      lists: orderById(
        (source.lists || []).filter((list) => list.project === data.id),
        data.lists || []
      ),
      // just to save an extra read for order
      __initialListsOrder: data.lists,
    }));
  }

  toFirestore() {
    return {
      ...copy(this, ['lastFetched', 'labels', 'lists', '__initialListsOrder']),
      lists: this.lists.ids,
    };
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
