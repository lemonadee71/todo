import { DEFAULT_COLORS } from '../../constants';
import { converter } from '../../utils/firestore';
import uuid from '../../utils/id';

class Label {
  constructor({ id, name, color, project }) {
    this.id = id || uuid();
    this.name = name;
    this.color = color || DEFAULT_COLORS[0];
    this.project = project;
  }

  static converter() {
    return converter(Label);
  }

  toJSON() {
    return { ...this };
  }

  toFirestore() {
    return { ...this };
  }
}

export default Label;
