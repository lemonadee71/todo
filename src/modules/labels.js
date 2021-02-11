import List from '../classes/List.js';
import Label from '../classes/Label.js';
import { getAllProjects } from './controller';

const labels = new List('labels', 'list', [
  new Label('urgent', '#FF9F1A'),
  new Label('important', '#EB5A46'),
]);

const addLabel = (name, color) => {
  let alreadyExists = labels.getItem((label) => label.name === name);

  if (!alreadyExists) {
    labels.addItem(new Label(name, color));
  } else {
    throw new Error('Label already exists.');
  }
};

const deleteLabel = (name) => {
  getAllProjects()
    .map((proj) => proj.items)
    .flat()
    .forEach((task) => task.removeLabel(name));

  labels.removeItems((label) => label.name === name);
};

const editLabel = (name, prop, value) => {
  labels.getItem((label) => label.name === name)[prop] = value;
};

const getLabels = () => labels.items;

export { addLabel, deleteLabel, editLabel, getLabels };
