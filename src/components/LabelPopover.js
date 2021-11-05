import { html, createHook } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT } from '../core/actions';
import { DEFAULT_COLORS } from '../core/constants';
import { useProject } from '../core/hooks';
import { dispatchCustomEvent } from '../utils/dispatch';
import uuid from '../utils/id';
import { $ } from '../utils/query';
import Label from './Label';

const LabelPopover = (data, action) => {
  const ref = { main: uuid(), name: uuid() };
  const [project, revoke] = useProject(data.project);
  const [state] = createHook({ isVisible: false });

  const unsubscribe = Core.event.on(PROJECT.LABELS.ADD + '.success', () => {
    $.data('id', ref.name).value = '';
  });

  const createLabel = (e) => {
    e.preventDefault();

    const name = e.target.elements['label-name'].value;
    const color = e.target.elements.color.value;

    Core.event.emit(PROJECT.LABELS.ADD, {
      project: data.project,
      data: { name, color },
    });
  };

  const toggleVisibility = (value) => {
    state.isVisible = value ?? !state.isVisible;
  };

  const closePopover = () =>
    dispatchCustomEvent($.data('id', ref.main), 'popover:hide');

  const init = function () {
    this.addEventListener('popover:toggle', () => toggleVisibility());
    this.addEventListener('popover:open', () => toggleVisibility(true));
    this.addEventListener('popover:hide', () => toggleVisibility(false));
  };

  return html`
    <div
      class="popover"
      data-id="${ref.main}"
      ${{
        '@create': init,
        '@destroy': () => {
          revoke();
          unsubscribe();
        },
        $visibility: state.$isVisible((val) => (val ? 'visible' : 'hidden')),
      }}
    >
      <span class="popover__close-btn" ${{ onClick: closePopover }}>
        &times;
      </span>
      <p class="popover__title">Labels</p>
      <div
        is-list
        class="popover__body"
        ${{
          $children: project.$labels.map((label) =>
            Label(label, action, data.getLabels().includes(label.id))
          ),
        }}
      ></div>
      <form ${{ onSubmit: createLabel }}>
        <label for="label-name" class="popover__title">
          Create New Label
        </label>
        <input type="text" name="label-name" data-id="${ref.name}" />
        <div class="color-picker">
          ${DEFAULT_COLORS.map(
            (color) =>
              html`
                <label class="color">
                  <input
                    class="color__input"
                    type="radio"
                    name="color"
                    value="${color}"
                  />
                  <span
                    class="color__choice"
                    ${{ backgroundColor: color }}
                  ></span>
                </label>
              `
          )}
        </div>
      </form>
    </div>
  `;
};

export default LabelPopover;
