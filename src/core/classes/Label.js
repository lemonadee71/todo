import uuid from '../../utils/id';
import { DEFAULT_COLORS } from '../constants';

class Label {
  constructor(name, color, id = null) {
    this.name = name;
    this.color = color || DEFAULT_COLORS[0];
    this.id = id || `label-${uuid(5)}`;
  }
}

export default Label;
