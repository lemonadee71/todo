import BaseTask from './BaseTask';

export default class Subtask extends BaseTask {
  constructor(props) {
    super(props);

    this.type = 'subtask';

    this.parent = props.parent;
    this.required = props.required;
  }
}
