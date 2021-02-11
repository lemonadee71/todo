import List from '../classes/List';

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
  {
    color: '#FF9F1A',
    text: 'urgent',
  },
  {
    color: '#EB5A46',
    text: 'important',
  },
];

export { defaultProjects, defaultLabelColors };
