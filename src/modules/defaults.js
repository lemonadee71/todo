import List from '../classes/List';
import Label from '../classes/Label';
import Task from '../classes/Task';

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
  new Label('Features', '#61BD4F'),
  new Label('Issues', '#F2D600'),
  new Label('Urgent', '#FF9F1A'),
  new Label('Important', '#EB5A46'),
  new Label('Styling', '#0079BF'),
  new Label('Coding', '#344563'),
];

const myTasks = new List('My Tasks', [
  new Task({
    title: 'Validate an edited label name',
    notes:
      'It is possible to have same label names when editing but not on creation. Fix this.',
    labels: [defaultLabels[1]],
  }),
  new Task({
    title: 'Fix styles',
    notes: `## Checklist
  - [] There should be spaces between TaskItems.
  - [] Add style to taskbar.
  - [] Add image to NoTasksMessage and styling.
  - [] There should be vertical space between labels when wrapped.
  - [] Action buttons gets pushed creating an overflow (in y) when a label is edited.
  - [] Elements inside notes should only inherit styles from markdown-body. This it to fix a bug like not showing a dot for a list item.
  - [] Header shouldn't be transparent.
  - [] Make it prettier.`,
    labels: [defaultLabels[1], defaultLabels[3], defaultLabels[4]],
  }),
  new Task({
    title: 'Learn Proxy and Reflect',
    notes: `- [] Improve Component.bind
  - [] Find a way to dynamically reproxy and revoke an object`,
    labels: [defaultLabels[5]],
  }),
  new Task({
    title: 'Component.js',
    notes: `## Todo
  - [] Shorthand type \`el.class\` and \`el#id\` should also be available for objectToString
  - [] Special keys like \`span\`, \`link\`, and \`paragraph\` should also be available for objectToString`,
    labels: [defaultLabels[5]],
  }),
  new Task({
    title: 'Fix more bugs',
    notes: `## Todo
  - [X] Chips and actions buttons are in front of header.`,
    labels: [defaultLabels[1], defaultLabels[5]],
    completed: true,
  }),
  new Task({
    title: 'Fix overflow bugs',
    notes: `- [] Title on TaskItem overflows\n- [] Title on TaskModal is clipped. Possible fix is change it to textarea (figure out how to dynamically change the height though)`,
    labels: [defaultLabels[1]],
  }),
]);

const defaultProjects = [myTasks];

export { defaultProjects, defaultLabelColors, defaultLabels };
