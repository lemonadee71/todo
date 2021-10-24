import OrderedIdList from './OrderedIdList';
import uuid from '../../utils/id';

class TaskList extends OrderedIdList {
  constructor({ name, id, project, position, defaultItems }) {
    super(defaultItems, 'id', 'position');
    this.id = id || `list-${uuid(8)}`;
    this.name = name || 'Unnamed Task';
    this.project = project;
    this.position = position;
  }

  add(task) {
    task.project = this.project;
    task.list = this.id;
    return super.add(task);
  }

  insert(task, idx) {
    task.project = this.project;
    task.list = this.id;
    return super.insert(task, idx);
  }
}

export default TaskList;
