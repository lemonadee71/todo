import Component from './Component.js';

let root = document.getElementById('root');

const Header = (title, className) => {
  return {
    className,
    paragraph: title,
  };
};

const Container = (items) => {
  return {
    type: 'ul',
    className: 'container',
    children: (() => {
      let arr = [];
      for (let i = 0; i < items; i++) {
        arr.push({
          type: 'li',
          text: `Item ${i + 1}`,
        });
      }
      return arr;
    })(),
  };
};

const Content = (items) => {
  return {
    type: 'div',
    id: 'content',
    text: `There are ${items} items in the database`,
    children: [Container(items)],
  };
};

/*
class App extends Component {
  render() {
    return {
      header: Header('Todo List', 'header'),
      content: Content(5),
    };
  }
}
*/

const App = () => {
  return {
    header: Header('Todo List', 'header'),
    content: Content(5),
  };
};

Component.render(root, App());
