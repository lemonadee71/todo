import IdList from './IdList';
import { DEFAULT_COLORS, PATHS } from '../../constants';
import { defaultLabels, defaultLists } from '../../default';
import uuid from '../../utils/id';
import { copy, intersectAndSortById, sieve } from '../../utils/misc';
import { converter } from '../../utils/firestore';

export default class Project {
  constructor({
    id,
    name,
    color,
    labels,
    lists,
    lastOpened,
    $$lastFetched,
    $$order,
  }) {
    // props
    this.id = id || uuid();
    this.name = name;
    this.color = color || DEFAULT_COLORS.green;

    // not used anywhere, just additional info for dashboard
    this.lastOpened = lastOpened;

    // firestore specific props
    // only set once on first fetched
    this.$$lastFetched = $$lastFetched;
    this.$$order = $$order ?? [];

    this.labels = new IdList();
    this.lists = new IdList();

    (labels || defaultLabels).map(this.addLabel.bind(this));
    (lists || defaultLists).map(this.addList.bind(this));
  }

  get link() {
    return PATHS.project.url.replace(':id', this.id);
  }

  static converter(source = {}) {
    return converter(Project, (data) => ({
      ...data,
      labels: source.labels?.filter((label) => label.project === data.id),
      lists: intersectAndSortById(source.lists || [], data.lists || []),
      // just to save an extra read for order
      $$order: data.lists,
    }));
  }

  toFirestore() {
    return sieve({
      ...copy(this, ['labels', 'lists', '$$lastFetched', '$$order']),
      lists: this.lists.ids,
    });
  }

  toJSON() {
    const allTasks = this.lists.items.flatMap((list) => list.items);
    const allSubtasks = allTasks.flatMap((task) => task.subtasks.items);

    return {
      data: {
        ...copy(this, ['labels', 'lists', '$$lastFetched', '$$order']),
        labels: this.labels.ids,
        lists: this.lists.ids,
      },
      labels: this.labels.toJSON(),
      lists: this.lists.toJSON(),
      tasks: allTasks.map((task) => task.toJSON()),
      subtasks: allSubtasks.map((subtask) => subtask.toJSON()),
    };
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
