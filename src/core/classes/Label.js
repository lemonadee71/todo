import { converter } from '../../utils/firestore';
import uuid from '../../utils/id';
import { DEFAULT_COLORS } from '../constants';

class Label {
  constructor({ name, color, project, id = null }) {
    this.name = name;
    this.color = color || DEFAULT_COLORS[0];
    this.id = id || uuid();
    this.project = project;
  }

  static converter() {
    return converter(Label);
  }

  toFirestore() {
    return { ...this };
  }
}

export default Label;
