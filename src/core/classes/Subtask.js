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

  static converter(source = {}) {
    return converter(Subtask, (data) => ({
      ...data,
      dueDate: data.dueDate && formatToDateTime(new Date(data.dueDate)),
      labels: filterById(source.labels || [], data.labels || []),
    }));
  }
}
