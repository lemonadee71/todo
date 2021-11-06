import Sortable from 'sortablejs';
import { html } from 'poor-man-jsx';
import { PROJECT, TASK } from '../core/actions';
import { useProject } from '../core/hooks';
import Core from '../core';
import logger from '../utils/logger';
import { $ } from '../utils/query';
import { appendError, wrap } from '../utils/misc';
import TaskModal from '../components/TaskModal';
import SubtaskModal from '../components/SubtaskModal';
import List from '../components/List';

const Project = ({ data: { id } }) => {
  const [project, revoke] = useProject(`project-${id}`);

  // this is like the root of app
  // so catch errors here for now
  const unsubscribe = [
    Core.event.on(
      appendError([PROJECT.ADD, PROJECT.LISTS.ADD, PROJECT.LABELS.ADD]),
      wrap(logger.warning)
    ),
    Core.event.on(
      appendError([
        PROJECT.UPDATE,
        PROJECT.LABELS.UPDATE,
        PROJECT.LISTS.UPDATE,
        TASK.UPDATE,
        TASK.SUBTASKS.UPDATE,
      ]),
      wrap(logger.error)
    ),
    // we put this here to avoid dependency cycle
    Core.event.on('task.modal.open', (data) => {
      $('#main-modal').changeContent(
        new TaskModal(data).render(),
        'task-modal'
      );
    }),
    Core.event.on('subtask.modal.open', (data) => {
      $('#main-modal').changeContent(
        new SubtaskModal(data).render(),
        'task-modal'
      );
    }),
  ];

  const createNewList = (e) => {
    e.preventDefault();

    const input = e.target.elements['new-list'];
    Core.event.emit(PROJECT.LISTS.ADD, {
      project: project.id,
      data: {
        name: input.value,
      },
    });

    input.value = '';
  };

  const init = function () {
    Sortable.create(this, {
      animation: 150,
      draggable: '.task-list',
      filter: '.task,.task--done',
      onUpdate: (e) => {
        Core.event.emit(PROJECT.LISTS.MOVE, {
          project: project.id,
          list: e.item.id,
          data: { position: e.newIndex },
        });
      },
    });
  };

  return html`
    <div
      class="project"
      ${{
        onDestroy: () => {
          revoke();
          unsubscribe.forEach((cb) => cb());
        },
      }}
    >
      <form ${{ onSubmit: createNewList }}>
        <input
          type="text"
          name="new-list"
          id="new-list"
          placeholder="Create new list"
        />
      </form>
      <h1 class="project__title" ${{ $textContent: project.$name }}></h1>
      <div
        class="project__body"
        is-list
        keystring="id"
        ${{ onCreate: init }}
        ${{ $children: project.$lists.map((list) => List(list)) }}
      ></div>
    </div>
  `;
};

export default Project;
