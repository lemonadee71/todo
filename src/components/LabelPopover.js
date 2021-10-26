import { html, createHook } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT } from '../core/actions';
import { dispatchCustomEvent } from '../utils/dispatch';
import { $ } from '../utils/query';
import Label from './Label';

const LabelPopover = (projectId, action) => {
  const [state] = createHook({
    isVisible: false,
    labels: Core.main.getLabels(projectId),
  });

  const unsubscribe = Core.event.on(PROJECT.LABELS.ALL, () => {
    state.labels = Core.main.getLabels(projectId);
  });

  const toggleVisibility = (value) => {
    state.isVisible = value ?? !state.isVisible;
  };

  const closePopover = () =>
    dispatchCustomEvent($('#label-popover'), 'popover:hide');

  const init = function () {
    this.addEventListener('popover:toggle', toggleVisibility);
    this.addEventListener('popover:open', () => toggleVisibility(true));
    this.addEventListener('popover:hide', () => toggleVisibility(false));
  };

  return html`
    <div
      id="label-popover"
      class="popover"
      ${{
        '@create': init,
        '@destroy': unsubscribe,
        $visibility: state.$isVisible((val) => (val ? 'visible' : 'hidden')),
      }}
    >
      <span class="popover__close-btn" ${{ onClick: closePopover }}>
        &times;
      </span>
      <span class="popover__title">Labels</span>
      <div
        is-list
        class="popover__body"
        ${{ $children: state.$labels.map((label) => Label(label, action)) }}
      ></div>
      <div id="new-label">
        <span class="popover__title">Create New Label</span>
      </div>
    </div>
  `;
};

export default LabelPopover;
