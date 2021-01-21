import Component from './component.js';
import { format } from 'date-fns';
import { Converter } from 'showdown';

const LabelList = (labels) => {
  return {
    type: 'div',
    children: labels.map((label) => {
      let { text, color } = label;

      return {
        text,
        type: 'div.label',
        style: {
          backgroundColor: color,
        },
      };
    }),
  };
};

const Checkbox = ({ checkHandler }) => {
  return {
    type: 'div.checkbox',
    children: [
      {
        type: 'div.check-btn',
        listener: {
          click: (e) => {
            e.target.classList.toggle('filled');

            checkHandler();
          },
        },
      },
    ],
  };
};

const CloseBtn = () => {
  return {
    type: 'span',
    attr: {
      innerHTML: '&times;',
    },
    listener: {
      click: (e) => {
        e.target.parentElement.style.display = 'none';
        e.stopPropagation();
      },
    },
  };
};

const DeleteBtn = (type, onDelete) => {
  if (type === 'span') {
    return {
      type: 'span.delete',
      prop: {
        innerHTML: 'delete icon',
      },
      listeners: {
        click: onDelete,
      },
    };
  }

  return {
    type: 'button.delete',
    prop: {
      innerHTML: 'delete icon',
    },
  };
};

const ModalContent = (task) => {
  const converter = new Converter();

  return Component.createFromObject({
    type: 'div.modal-content',
    children: [
      CloseBtn(),
      {
        type: 'h2',
        text: 'title',
      },
      {
        type: 'textarea',
        prop: {
          innerHTML: converter.makeHtml(task.desc) || '',
        },
        listeners: {
          keydown: (e) => {
            task.desc = e.target.value;
          },
          focusout: (e) => {
            task.desc = e.target.value;
          },
        },
      },
      {
        type: 'input',
        attr: {
          type: 'date',
          value: task.dueDate || '',
        },
        listeners: {
          change: (e) => {
            task.dueDate = e.target.value;
          },
        },
      },
    ],
  });
};

const TaskCard = (task, props) => {
  let { info, onDelete } = props;

  const openModal = () => {
    let modal = document.getElementById('modal');
    modal.innerHTML = '';

    modal.appendChild(ModalContent(task));
    modal.style.display = 'block';
  };

  const checkHandler = (e) => {
    let completed = task.toggleComplete();
    let status = completed ? 'completed' : 'current';

    let tasksDOM = document.getElementById(`${status}-tasks`);
    tasksDOM.appendChild(e.target.parentElement);
  };

  return Component.createFromObject({
    type: 'div.task',
    children: [
      Checkbox({ checkHandler }),
      LabelList(task.labels),
      {
        type: 'div.title',
        text: task.title,
      },
      {
        type: 'div',
        text: task.desc, // If task.desc is not null, display an icon instead (like in Trello)
      },
      {
        type: 'div',
        text: format(task.dueDate, 'E..EEE, MMM dd'),
      },
    ],
    listeners: {
      click: openModal,
    },
  });
};

export default TaskCard;
