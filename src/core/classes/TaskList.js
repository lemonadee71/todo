import OrderedIdList from './OrderedIdList';
import uuid from '../../utils/id';

class TaskList extends OrderedIdList {
  constructor({ name, id, project, position, defaultItems }) {
    super(defaultItems);

    this.id = id || `list-${uuid(8)}`;
    this.name = name || 'Unnamed List';
    this.project = project;
    this.position = position;
  }

  set name(name) {
    this.name = name || 'Unnamed List';

    return this.name;
  }

  add(task) {
    const tasks = [task].flat().map((item) => {
      item.project = this.project;
      item.list = this.id;

      return item;
    });

    return super.add(tasks);
  }

  insert(task, idx) {
    task.project = this.project;
    task.list = this.id;

    return super.insert(task, idx);
  }
}

export default TaskList;
