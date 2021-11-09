import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT } from '../core/actions';
import { debounce } from '../utils/delay';

const Label = (data, action, isSelected) => {
  const [state] = createHook({ isNotEditing: true });

  const clickLabel = (e) => {
    // label element triggers click twice
    // so ignore the other one for the input
    if (
      !state.isNotEditing ||
      e.target.matches('input') ||
      e.target.matches('button')
    )
      return;

    const label = e.currentTarget;
    const [base, modifier] = label.className.split('--');

    if (modifier) label.className = base;
    else label.className = `${base}--selected`;

    action(label.getAttribute('key'), !modifier);
  };

  const editLabel = debounce((e) => {
    Core.event.emit(
      PROJECT.LABELS.UPDATE,
      {
        project: data.project,
        label: data.id,
        data: { prop: 'name', value: e.target.value },
      },
      {
        onError: () => {
          e.target.value = data.name;
        },
      }
    );
  }, 200);

  const deleteLabel = () => {
    Core.event.emit(PROJECT.LABELS.REMOVE, {
      project: data.project,
      label: data.id,
    });
  };

  const toggleEditing = () => {
    state.isNotEditing = !state.isNotEditing;
  };

  // TODO: Fix styles to accommodate the buttons
  return html`
    <div
      class="label${isSelected ? '--selected' : ''}"
      key="${data.id}"
      style="background-color: ${data.color};"
      ${{ onClick: clickLabel }}
    >
      <label class="label__text">
        <span
          ${{
            $display: state.$isNotEditing((val) => (val ? 'inline' : 'none')),
          }}
        >
          {% ${data.name} %}
        </span>
        <input
          type="text"
          value="${data.name}"
          placeholder="Label name"
          ${{
            $display: state.$isNotEditing((val) =>
              val ? 'none' : 'inline-block'
            ),
            onBlur: (e) => {
              editLabel(e);
              toggleEditing();
            },
          }}
        />
      </label>
      <div>
        <button ${{ onClick: toggleEditing }}>Edit</button>
        <button ${{ onClick: deleteLabel }}>Delete</button>
      </div>
    </div>
  `;
};
export default Label;
