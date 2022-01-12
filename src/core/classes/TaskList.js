import IdList from './IdList';
import uuid from '../../utils/id';
import { converter } from '../../utils/firestore';
import { orderByIds } from '../../utils/misc';

class TaskList extends IdList {
  constructor({ name, id, project, defaultItems }) {
    super(defaultItems);

    this.id = id || uuid();
    this.name = name || 'Unnamed List';
    this.project = project;
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
      tasks: this.items.map((item) => item.id),
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
