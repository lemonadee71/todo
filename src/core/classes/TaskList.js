import List from './List';

class TaskList extends List {
  constructor(props) {
    super(props);
    this.project = props.project;
    this.position = props.position || 0;

    // initialize list
    this.updatePosition();
  }

  updatePosition() {
    // update task position based on their index
    this.items.forEach((task, i) => {
      task.position = i;
    });
    this.items.sort((a, b) => a.position - b.position);

    return this;
  }

  add(item, position = null) {
    if (position !== null) {
      this.insert(item, position);
    } else {
      super.add(item);
    }

    return this.updatePosition();
  }

  delete(predicate) {
    super.delete(predicate);
    return this.updatePosition();
  }

  insert(item, idx) {
    this.items.splice(idx, 0, item);
  }

  move(predicate, idx) {
    const item = super.extract(predicate);
    this.insert(item, idx);
    return this.updatePosition();
  }
}

export default TaskList;
