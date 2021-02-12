import List from '../classes/List';
import Label from '../classes/Label';
import Task from '../classes/Task';

const defaultProjects = [
  new List('foo', 'project'),
  new List('bar', 'project'),
  new List('baz', 'project'),
];

const defaultLabelColors = [
  '#61BD4F',
  '#F2D600',
  '#FF9F1A',
  '#EB5A46',
  '#C377E0',
  '#0079BF',
  '#00C2E0',
  '#51E898',
  '#FF78CB',
  '#344563',
];

const defaultLabels = [
  new Label('urgent', '#FF9F1A'),
  new Label('important', '#EB5A46'),
];

export { defaultProjects, defaultLabelColors, defaultLabels };
