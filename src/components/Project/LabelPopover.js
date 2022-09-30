import { html, createHook } from 'poor-man-jsx';
import { PROJECT } from '../../actions';
import Core from '../../core';
import { useProject } from '../../core/hooks';
import { dispatchCustom } from '../../utils/dispatch';
import { addSchema } from '../../utils/validate';
import Label from './Label';

const LabelPopover = (data, clickAction) => {
  const [project, revoke] = useProject(data.project);
  const state = createHook({
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

  return html`
    <div
      :show.visibility=${state.$isVisible}
      id="label-popover"
      class="relative text-white bg-[#272727] w-56 px-3 pt-5 pb-3 rounded-md"
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
        :show.visibility=${state.$inEditMode}
        class="absolute top-0 left-0 ml-3 text-lg"
        aria-label="Go back"
        onClick=${() => toggleEditingMode()}
      >
        &#8249;
      </button>

      <div>
        ${state.$inEditMode((value) =>
          value
            ? html`
                <form class="space-y-2" onSubmit.prevent=${editLabel}>
                  <label
                    for="label-name"
                    class="text-sm font-medium text-gray-400"
                  >
                    Edit name
                  </label>
                  <auto-textarea
                    :validate=${{ schema: 'label', showError: true }}
                    class="text-black font-medium w-full px-1"
                    id="label-name"
                    name="label-name"
                    placeholder="Label name"
                    value=${state.currentTarget.name}
                    required
                    onMount=${(e) => e.target.focus()}
                  />

                  <color-choices
                    class="stext-sm font-medium text-gray-400"
                    value=${state.currentTarget.color}
                    legend="Edit color"
                  />

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
              `
            : html`
                <h4 id="label-heading" class="text-md font-medium mb-2">
                  Labels
                </h4>

                <div
                  class="mb-2 flex flex-col gap-1"
                  aria-labelledby="label-heading"
                >
                  ${project.$labels.map((label) => {
                    const isSelected = data.getLabels().includes(label.id);

                    return Label(
                      label,
                      clickAction,
                      toggleEditingMode,
                      isSelected
                    );
                  })}
                </div>

                <form class="space-y-2" onSubmit.prevent=${createLabel}>
                  <label for="new-label-name" class="text-base font-medium">
                    Create New Label
                  </label>
                  <input
                    :validate=${{ schema: 'label', showError: true }}
                    class="text-black font-medium w-full px-1 rounded focus:ring"
                    type="text"
                    id="new-label-name"
                    name="new-label-name"
                    required
                  />
                  <color-choices class="sr-only" legend="Select a color" />
                </form>
              `
        )}
      </div>
    </div>
  `;
};

addSchema('label', {
  custom: {
    maxlength: (str) => str.length <= 50,
  },
  messages: {
    maxlength: 'Label name must be less than 50 characters',
  },
});

export default LabelPopover;
