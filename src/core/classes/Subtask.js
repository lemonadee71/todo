import { formatToDateTime } from '../../utils/date';
import { converter } from '../../utils/firestore';
import { filterById } from '../../utils/misc';
import BaseTask from './BaseTask';

export default class Subtask extends BaseTask {
  constructor(props) {
    super(props);

    this.type = 'subtask';
    this.parent = props.parent;
  }

  get location() {
    return {
      project: this.project,
      list: this.list,
      task: this.parent,
      subtask: this.id,
    };
  }

  set location(data) {
    this.update('project', data.project);
    this.update('list', data.list);
    this.update('parent', data.task);
  }

  static converter(source = {}) {
    return converter(Subtask, (data) => ({
      ...data,
      dueDate: data.dueDate && formatToDateTime(new Date(data.dueDate)),
      labels: filterById(source.labels || [], data.labels || []),
    }));
  }
}
