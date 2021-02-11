class Label {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.id = `label-${Math.random()}`.replace(/0./, '');
  }
}

export default Label;
