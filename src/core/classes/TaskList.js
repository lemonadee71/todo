import OrderedIdList from './OrderedIdList';
import uuid from '../../utils/id';
import { converter } from '../../utils/firestore';
import { orderByIds } from '../../utils/misc';

class TaskList extends OrderedIdList {
  constructor({ name, id, project, position, defaultItems }) {
    super(defaultItems);

    this.id = id || uuid();
    this.name = name || 'Unnamed List';
    this.project = project;
    this.position = position;
  }

  static converter(source = {}) {
    return converter(TaskList, (data) => ({
      ...data,
      defaultItems: orderByIds(
        data.tasks || [],
        (source.tasks || []).filter((task) => task.list === data.id)
      ),
    }));
  }

  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      project: this.project,
      position: this.position,
      tasks: this.orderOfItems,
    };
  }

  add(task) {
    const tasks = [task].flat().map((item) => {
      item.project = this.project;
      item.list = this.id;
      item.updateSubtasks();

      return item;
    });

    return super.add(tasks);
  }

  insert(task, idx) {
    task.project = this.project;
    task.list = this.id;
    task.updateSubtasks();

    return super.insert(task, idx);
  }
}

export default TaskList;
