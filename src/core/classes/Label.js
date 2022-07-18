import { converter } from '../../utils/firestore';
import uuid from '../../utils/id';
import { sieve } from '../../utils/misc';

class Label {
  constructor({ id, name, color, project }) {
    this.id = id || uuid();
    this.name = name;
    this.color = color;
    this.project = project;
  }

  static converter() {
    return converter(Label);
  }

  toJSON() {
    return { ...this };
  }

  toFirestore() {
    return sieve({ ...this });
  }
}

export default Label;
