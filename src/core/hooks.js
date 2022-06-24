import { query, where } from 'firebase/firestore';
import { createHook, html, render } from 'poor-man-jsx';
import Core from '.';
import { FIREBASE, PROJECT, TASK } from '../actions';
import { isGuest } from '../utils/auth';
import { getCollectionRef, getDocuments } from '../utils/firestore';
import { copy } from '../utils/misc';

export const useRoot = () => {
  const [state] = createHook({ projects: Core.main.getAllProjects() });

  const unsubscribe = Core.event.onSuccess(PROJECT.ALL, () => {
    state.projects = Core.main.getAllProjects();
  });

  return [state, unsubscribe];
};

// we rely on changes to original references
// to be reflected here
export const useProject = (projectId) => {
  const projectRef = Core.main.getProject(projectId);
  const [project] = createHook({
    // Add other properties if needed
    id: projectRef.id,
    name: projectRef.name,
    color: projectRef.color,
    lists: projectRef.lists.items,
    labels: projectRef.labels.items,
  });

  const unsubscribe = [
    Core.event.onSuccess(
      [
        ...PROJECT.LISTS.ALL,
        ...PROJECT.LABELS.ALL,
        ...TASK.ALL,
        ...TASK.LABELS.ALL,
        ...TASK.SUBTASKS.ALL,
        FIREBASE.TASK.FETCH_COMPLETED,
      ],
      () => {
        project.lists = projectRef.lists.items;
        project.labels = projectRef.labels.items;
      }
    ),
    Core.event.onSuccess(PROJECT.UPDATE, () => {
      project.name = projectRef.name;
      project.color = projectRef.color;
    }),
  ];

  const revoke = () => unsubscribe.forEach((cb) => cb());

  return [project, revoke];
};

// for both task and subtask
export const useTask = (projectId, listId, taskId, subtaskId = null) => {
  const get = subtaskId ? Core.main.getSubtask : Core.main.getTask;
  const taskRef = get(projectId, listId, taskId, subtaskId);
  const [task] = createHook(taskRef.data);

  const action = subtaskId ? TASK.SUBTASKS : TASK;

  const unsubscribe = [
    Core.event.onSuccess(action.UPDATE, (newData) => {
      Object.assign(task, newData.data);
    }),
    Core.event.onSuccess([...TASK.LABELS.ALL, ...PROJECT.LABELS.ALL], () => {
      task.labels = taskRef.data.labels;
    }),
  ];

  if (!subtaskId) {
    unsubscribe.push(
      Core.event.onSuccess(
        [...TASK.SUBTASKS.ALL, ...TASK.LABELS.ALL, ...PROJECT.LABELS.ALL],
        () => {
          task.subtasks = taskRef.subtasks.items;
        }
      )
    );
  }

  const revoke = () => unsubscribe.forEach((cb) => cb());

  return [task, revoke];
};

export const useLocationOptions = (data = {}) => {
  const [root, unsubscribe] = useRoot();
  const [state] = createHook({
    project: data.project,
    list: data.list,
    listOptions: [],
  });

  const turnItemsToOptions = (items, defaultValue) =>
    items.map(
      (item, i) =>
        html`
          <option
            value="${item.id}"
            selected=${item.id === defaultValue || (i === 0 && !defaultValue)}
          >
            ${item.name}
          </option>
        `
    );

  const renderProjectOptions = (items) => {
    const blank = html`<option
      hidden
      disabled
      value
      selected=${!state.project}
    ></option>`;
    const options = [blank, ...turnItemsToOptions(items, state.project)];

    return render(html`${options}`);
  };

  const renderListOptions = (items) =>
    render(html`${turnItemsToOptions(items, state.list)}`);

  const syncListOptions = async (projectId) => {
    let result = [];

    if (!projectId) {
      result = [];
    } else if (Core.data.fetched.projects.includes(projectId)) {
      result = Core.main.getLists(projectId);
    } else if (!isGuest()) {
      result = await getDocuments(
        query(getCollectionRef('Lists'), where('project', '==', projectId))
      );
    }

    state.listOptions = renderListOptions(result);

    return result;
  };

  const onListChange = (onChange) => (e) => {
    state.list = e.target.value;
    onChange?.(e, copy(state, ['listOptions']));
  };

  const onProjectChange = (onChange) => (e) => {
    state.project = e.target.value;

    (async () => {
      state.list = null;
      const lists = await syncListOptions(state.project);
      // default list is the first one if transferred to new project
      state.list = lists[0].id;

      onChange?.(e, copy(state, ['listOptions']));
    })();
  };

  return {
    onProjectChange,
    onListChange,
    projectOptions: root.$projects(renderProjectOptions),
    listOptions: state.$listOptions(),
    initializeListOptions: async () => syncListOptions(state.project),
    unsubscribe,
  };
};
