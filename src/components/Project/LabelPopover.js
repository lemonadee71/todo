import { html, createHook, render } from 'poor-man-jsx';
import Core from '../../core';
import { PROJECT } from '../../core/actions';
import { useProject } from '../../core/hooks';
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

  const toggleVisibility = (value) => {
    state.isVisible = value ?? !state.isVisible;
  };

  const closePopover = () => {
    // clear state
    state.inEditMode = false;
    state.currentTarget = null;
    toggleVisibility(false);
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
        project: state.currentTarget.project,
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
    Core.event.emit(PROJECT.LABELS.REMOVE, {
      project: state.currentTarget.project,
      label: state.currentTarget.id,
    });
  };

  return html`
    <div
      id="label-popover"
      class="relative text-white bg-[#272727] w-56 px-3 pt-5 pb-3 rounded-md"
      style_visibility=${state.$isVisible((val) =>
        val ? 'visible' : 'hidden'
      )}
      onPopover:toggle=${() => toggleVisibility()}
      onPopover:open=${() => toggleVisibility(true)}
      onPopover:hide=${() => toggleVisibility(false)}
      onDestroy=${revoke}
    >
      <button
        class="absolute top-0 right-0 mr-3 text-lg"
        onClick=${closePopover}
      >
        &times;
      </button>
      <button
        class="absolute top-0 left-0 ml-3 text-lg"
        style_visibility=${state.$inEditMode((value) =>
          value ? 'visible' : 'hidden'
        )}
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
                    class="text-sm font-medium text-gray-500"
                  >
                    Edit Label
                  </label>
                  <!-- prettier-ignore -->
                  <textarea
                    class="text-black font-medium w-full px-1 rounded focus:ring resize-none break-words"
                    id="label-name"
                    name="label-name"
                    placeholder="Label name..."
                    rows="1"
                    data-autosize
                  >${state.currentTarget.name}</textarea>

                  <p class="text-sm font-medium text-gray-500">
                    Select a color
                  </p>
                  ${ColorChoices(state.currentTarget.color)}

                  <div class="text-base w-full flex flex-row justify-between">
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
                <h4 class="text-md font-medium mb-2">Labels</h4>

                <div is-list class="mb-2 flex flex-col gap-1">
                  ${project.$labels
                    .map((label) =>
                      Label(
                        label,
                        clickAction,
                        toggleEditingMode,
                        data.getLabels().includes(label.id)
                      )
                    )
                    .map((item) => render(item))}
                </div>

                <form class="space-y-2" onSubmit.prevent=${createLabel}>
                  <label for="new-label-name" class="text-base font-medium">
                    Create New Label
                  </label>
                  <input
                    class="text-black font-medium w-full px-1 rounded focus:ring"
                    name="new-label-name"
                    id="new-label-name"
                    type="text"
                  />

                  ${ColorChoices()}
                </form>
              `)
        )}
      </div>
    </div>
  `;
};

export default LabelPopover;
