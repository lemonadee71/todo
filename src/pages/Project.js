import Sortable from 'sortablejs';
import { createHook, html } from 'poor-man-jsx';
import { PROJECT } from '../core/actions';
import { useProject } from '../core/hooks';
import Core from '../core';
import Calendar from '../components/Calendar';
import List from '../components/Project/List';

const Project = ({ data: { id } }) => {
  const [project, unsubscribe] = useProject(id);
  const [state] = createHook({ isListView: true });

  const switchView = () => {
    state.isListView = !state.isListView;
  };

  const createNewList = (e) => {
    e.preventDefault();

    const input = e.target.elements['new-list'];
    Core.event.emit(PROJECT.LISTS.ADD, {
      project: project.id,
      data: { name: input.value },
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
    <div class="project" ${{ onDestroy: unsubscribe }}>
      <header class="project__header">
        <h1 class="project__title" ${{ $textContent: project.$name }}></h1>
        <button
          ${{
            onClick: switchView,
            $textContent: state.$isListView((value) =>
              value ? 'Switch to calendar view' : 'Switch to list view'
            ),
          }}
        ></button>
      </header>
      <div
        class="project__body"
        ${{
          $children: state.$isListView((value) =>
            value
              ? html`
                  <form ${{ onSubmit: createNewList }}>
                    <input
                      type="text"
                      name="new-list"
                      id="new-list"
                      placeholder="Create new list"
                    />
                  </form>
                  <div
                    is-list
                    keystring="id"
                    class="list-view"
                    ${{ onCreate: init }}
                    ${{ $children: project.$lists.map((list) => List(list)) }}
                  ></div>
                `
              : Calendar(id)
          ),
        }}
      ></div>
    </div>
  `;
};

export default Project;
