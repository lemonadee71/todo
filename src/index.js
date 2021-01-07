import Component from './Component.js';

let root = document.getElementById('root');

function Header({ title, className }) {
  return {
    className,
    paragraph: `This is my header with title ${title}`,
  };
}

function Content({ items }) {
  return {
    type: 'div',
    id: 'content',
    text: `There are ${items} in the database`,
  };
}

class App extends Component {
  render() {
    return {
      header: {
        type: Header,
        props: {
          className: 'header',
          title: 'Todo List',
        },
      },
      content: {
        type: Content,
        props: {
          items: 5,
        },
      },
    };
  }
}

Component.render(root, new App());
