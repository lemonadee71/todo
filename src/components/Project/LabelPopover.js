import { html, createHook, render } from 'poor-man-jsx';
import { PROJECT } from '../../actions';
import Core from '../../core';
import { useProject } from '../../core/hooks';
import { dispatchCustom } from '../../utils/dispatch';
import { addSchema } from '../../utils/validate';
import ColorChoices from './ColorChoices';
import Label from './Label';

const LabelPopover = (data, clickAction) => {
  const [project, revoke] = useProject(data.project);
  const [state] = createHook({
    isVisible: false,
    inEditMode: false,
    currentTarget: null,
  });

  const toggleEditingMode = (target = null) => {
    // store data of currently editing label; otherwise clear it
    state.currentTarget = target;
    state.inEditMode = !state.inEditMode;
  };

  const togglePopover = () => {
    if (state.isVisible) closePopover();
    else openPopover();
  };

  const openPopover = () => {
    state.isVisible = true;
  };

  const closePopover = () => {
    state.isVisible = false;
    // clear state
    state.inEditMode = false;
    state.currentTarget = null;
  };

  const createLabel = (e) => {
    const name = e.target.elements['new-label-name'];
    const color = e.target.elements['label-color'].value;

    Core.event.emit(
      PROJECT.LABELS.ADD,
      {
        project: data.project,
        data: { name: name.value, color },
      },
      {
        onSuccess: () => {
          name.value = '';
        },
      }
    );
  };

  const editLabel = (e) => {
    const name = e.target.elements['label-name'];
    const color = e.target.elements['label-color'].value;

    Core.event.emit(
      PROJECT.LABELS.UPDATE,
      {
        project: data.project,
        label: state.currentTarget.id,
        data: { name: name.value, color },
      },
      {
        onSuccess: toggleEditingMode,
        onError: () => {
          name.value = data.name;
        },
      }
    );
  };

  const deleteLabel = () => {
    Core.event.emit(
      PROJECT.LABELS.REMOVE,
      {
        project: data.project,
        label: state.currentTarget.id,
      },
      { onSuccess: toggleEditingMode }
    );
  };

  // TODO: Put a character limit to label name
  return html`
    <div
      id="label-popover"
      class="relative text-white bg-[#272727] w-56 px-3 pt-5 pb-3 rounded-md"
      style_visibility=${state.$isVisible((val) =>
        val ? 'visible' : 'hidden'
      )}
      onPopover:toggle=${togglePopover}
      onPopover:open=${openPopover}
      onPopover:hide=${closePopover}
      onDestroy=${revoke}
    >
      <button
        class="absolute top-0 right-0 mr-3 text-lg"
        aria-label="Close popover"
        onClick=${(e) => dispatchCustom('popover:hide', e.target.parentElement)}
      >
        &times;
      </button>
      <button
        class="absolute top-0 left-0 ml-3 text-lg"
        style_visibility=${state.$inEditMode((value) =>
          value ? 'visible' : 'hidden'
        )}
        aria-label="Go back"
        onClick=${() => toggleEditingMode()}
      >
        &#8249;
      </button>

      <div>
        ${state.$inEditMode((value) =>
          value
            ? render(html`
                <form class="space-y-2" onSubmit.prevent=${editLabel}>
                  <label
                    for="label-name"
                    class="text-sm font-medium text-gray-400"
                  >
                    Edit name
                  </label>
                  <!-- prettier-ignore -->
                  <textarea
                    class="text-black font-medium w-full px-1 rounded focus:ring resize-none"
                    id="label-name"
                    name="label-name"
                    placeholder="Label name"
                    rows="1"
                    data-autosize
                    data-schema="label"
                    data-validate
                    data-validate-show-error
                    onMount=${(e) => e.target.focus()}
                  >${state.currentTarget.name}</textarea>

                  ${ColorChoices(
                    'Edit color',
                    'text-sm font-medium text-gray-400',
                    state.currentTarget.color
                  )}

                  <div class="text-base flex flex-row justify-between">
                    <button class="rounded px-2 py-1 bg-blue-700" type="submit">
                      Save
                    </button>
                    <button
                      class="rounded px-2 py-1 bg-red-600"
                      onClick=${deleteLabel}
                    >
                      Delete
                    </button>
                  </div>
                </form>
              `)
            : render(html`
                <h4 id="label-heading" class="text-md font-medium mb-2">
                  Labels
                </h4>

                <div
                  is-list
                  class="mb-2 flex flex-col gap-1"
                  aria-labelledby="label-heading"
                >
                  ${project.$labels
                    .map((label) => {
                      const isSelected = data.getLabels().includes(label.id);

                      return Label(
                        label,
                        clickAction,
                        toggleEditingMode,
                        isSelected
                      );
                    })
                    .map((item) => render(item))}
                </div>

                <form class="space-y-2" onSubmit.prevent=${createLabel}>
                  <label for="new-label-name" class="text-base font-medium">
                    Create New Label
                  </label>
                  <input
                    class="text-black font-medium w-full px-1 rounded focus:ring"
                    type="text"
                    id="new-label-name"
                    name="new-label-name"
                    data-schema="label"
                    data-validate
                    data-validate-show-error
                  />

                  ${ColorChoices('Select a color', 'sr-only')}
                </form>
              `)
        )}
      </div>
    </div>
  `;
};

addSchema('label', {
  required: true,
  custom: {
    maxlength: (str) => str.length <= 50,
  },
  messages: {
    maxlength: 'Label name must be less than 50 characters',
  },
});

export default LabelPopover;
