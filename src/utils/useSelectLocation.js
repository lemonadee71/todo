import { query, where } from 'firebase/firestore';
import { createHook, html, render } from 'poor-man-jsx';
import Core from '../core';
import { useRoot } from '../core/hooks';
import { getCollectionRef, getDocuments } from './firestore';
import { copy } from './misc';

export const useSelectLocation = (data = {}) => {
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
    let result;

    if (!projectId) {
      result = [];
    } else if (Core.data.fetched.projects.includes(projectId)) {
      result = Core.main.getLists(projectId);
    } else {
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
