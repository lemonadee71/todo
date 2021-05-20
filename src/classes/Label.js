import uuid from '../helpers/id';

class Label {
  constructor(name, color, id = null) {
    this.name = name;
    this.color = color;
    this.id = id || `label-${uuid(5)}`;
  }
}

export default Label;
