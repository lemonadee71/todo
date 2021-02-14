class Label {
  constructor(name, color, id = null) {
    this.name = name;
    this.color = color;
    this.id = id || `label-${Math.random()}`.replace(/0./, '');
  }
}

export default Label;
