import PoorManJSX, { html } from 'poor-man-jsx';
import { EDIT_TASK } from '../actions';
import { DEFAULT_COLORS } from '../constants';
import Core from '../core';
import { isGuest } from '../utils/auth';
import { runOnlyIfClick } from '../utils/keyboard';

const GlobalTask = ({ children, props }) => {
  const { data } = props;
  const projectData = Core.main.getProject(data.project);

  const openOnLocation = () => {
    const url = projectData.link;

    if (url !== Core.state.currentPage) {
      Core.data.queue.push(data.location);
      Core.router.navigate(url, { title: projectData.name });
    } else {
      // it's okay to emit directly since we know that data is already fetched
      Core.event.emit(
        EDIT_TASK,
        Core.main.getTask(...Object.values(data.location))
      );
    }
  };

  const hasSubtasks = isGuest() ? data.totalSubtasks : data.$$order.length;

  const badges = [
    ...(props.badges || []),
    data.dueDate && html`<date-badge data=${data} compact="true" />`,
    hasSubtasks &&
      html`
        <common-badge
          background=${DEFAULT_COLORS.gray}
          props=${{
            _key: 'subtasks',
            'aria-label': 'This task has subtasks',
            'data-tooltip': '$aria-label',
          }}
        >
          <my-icon class="stroke-white stroke-2" size="16" decorative="true" />
        </common-badge>
      `,
  ];

  const template = {
    ...props.template,
    main: {
      ...(props.template?.main || {}),
      onKeydown: [
        runOnlyIfClick(openOnLocation),
        props.template?.main?.onKeydown || [],
      ].flat(),
    },
    labels: { _show: false },
  };

  return html`
    <task-template
      type=${data.type}
      id=${data.id}
      title=${data.title}
      completed=${data.completed}
      badges=${badges}
      labels=${data.labels}
      template=${template}
    >
      <div
        :slot="before_main"
        class="self-stretch w-1"
        style="background-color: ${projectData.color};"
      ></div>

      <button
        :slot="after_main"
        class="px-2 py-1 rounded text-white text-sm bg-sky-500 hover:bg-sky-600 invisible group-hover:visible"
        onClick=${openOnLocation}
        ${template.openButton}
      >
        Open
      </button>

      ${children}
    </task-template>
  `;
};

PoorManJSX.customComponents.define('global-task', GlobalTask);
