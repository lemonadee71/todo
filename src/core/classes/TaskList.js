import IdList from './IdList';
import uuid from '../../utils/id';
import { converter } from '../../utils/firestore';
import { orderById } from '../../utils/misc';

class TaskList extends IdList {
  constructor({ name, id, project, defaultItems, __initialTasksOrder }) {
    super(defaultItems);

    this.id = id || uuid();
    this.name = name || 'Unnamed List';
    this.project = project;

    this.__initialTasksOrder = __initialTasksOrder ?? [];
  }

  static converter(source = {}) {
    return converter(TaskList, (data) => ({
      ...data,
      defaultItems: orderById(
        (source.tasks || []).filter((task) => task.list === data.id),
        data.tasks || []
      ),
      __initialTasksOrder: data.tasks,
    }));
  }

  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      project: this.project,
      tasks: this.items
        .filter((item) => !item.completed)
        .map((item) => item.id),
    };
  }

  get completedTasks() {
    return this.items.filter((task) => task.completed).length;
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
