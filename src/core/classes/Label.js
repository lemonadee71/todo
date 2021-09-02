import uuid from '../../utils/id';

class Label {
  constructor(name, color, id = null) {
    this.name = name;
    this.color = color;
    this.id = id || uuid(5);
  }
}

export default Label;
