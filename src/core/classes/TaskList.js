import IdList from './IdList';
import uuid from '../../utils/id';
import { converter } from '../../utils/firestore';
import { sortById } from '../../utils/misc';

class TaskList extends IdList {
  constructor({ id, name, project, tasks, $$order }) {
    super(tasks);

    this.id = id || uuid();
    this.name = name || 'Unnamed List';
    this.project = project;

    this.$$order = $$order ?? [];
  }

  get completedTasks() {
    return this.items.filter((task) => task.completed).length;
  }

  static converter(source = {}) {
    return converter(TaskList, (data) => ({
      ...data,
      tasks: sortById(
        (source.tasks || []).filter((task) => task.list === data.id),
        data.tasks || []
      ),
      $$order: data.tasks,
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

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      project: this.project,
      tasks: this.ids,
    };
  }

  add(task) {
    const tasks = [task].flat().map((item) => {
      item.location = { project: this.project, list: this.id };
      item.updateSubtasks();

      return item;
    });

    return super.add(tasks);
  }

  insert(task, idx) {
    task.location = { project: this.project, list: this.id };
    task.updateSubtasks();

    return super.insert(task, idx);
  }
}

export default TaskList;
