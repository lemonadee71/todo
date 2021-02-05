import List from '../list.js';

const labels = new List('labels', 'list', [
  {
    color: '#FF9F1A',
    name: 'urgent',
  },
  {
    color: '#EB5A46',
    name: 'important',
  },
]);

const addLabel = (name, color) => {
  let alreadyExists = labels.getItem((label) => label.name === name);

  if (!alreadyExists) {
    labels.addItem({ name, color });
  } else {
    throw new Error('Label already exists.');
  }
};

const deleteLabel = (name) => {
  labels.removeItems((label) => label.name === name);
};

const editLabel = (name, prop, value) => {
  labels.getItem((label) => label.name === name)[prop] = value;
};

const getLabels = () => labels.items;

export { addLabel, deleteLabel, editLabel, getLabels };
