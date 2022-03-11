import { getDocs, query, where } from 'firebase/firestore';
import { createHook, html, render } from 'poor-man-jsx';
import Core from '../core';
import { useRoot } from '../core/hooks';
import { isGuest } from './auth';
import { getCollectionRef, getData } from './firestore';
import { copyObject } from './misc';

export const useSelectLocation = (onChange, data = {}) => {
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
            ${{
              selected: item.id === defaultValue || (i === 0 && !defaultValue),
            }}
          >
            ${item.name}
          </option>
        `
    );

  const renderProjectNames = (items) => {
    const blank = html`<option
      hidden
      disabled
      value
      ${{ selected: !state.project }}
    ></option>`;
    const options = [blank, ...turnItemsToOptions(items, state.project)];

    return render(html`${options}`);
  };

  const renderListNames = (items) =>
    render(html`${turnItemsToOptions(items, state.list)}`);

  const showListOptions = async (projectId) => {
    if (!projectId) {
      state.listOptions = [];
    } else if (isGuest()) {
      state.listOptions = renderListNames(Core.main.getLists(projectId));
    } else {
      const result = await getDocs(
        query(getCollectionRef('Lists'), where('project', '==', projectId))
      );

      state.listOptions = renderListNames(result.docs?.map(getData));
    }
  };

  const selectList = (e) => {
    state.list = e.target.value;
    onChange?.(e, copyObject(state, ['listOptions']), 'list');
  };

  const selectProject = (e) => {
    state.project = e.target.value;

    (async () => {
      state.list = null;
      await showListOptions(state.project);
      state.list = e.target.nextElementSibling.value;

      onChange?.(e, copyObject(state, ['listOptions']), 'project');
    })();
  };

  const component = html`
    <select name="project" onDestroy=${unsubscribe} onChange=${selectProject}>
      ${root.$projects(renderProjectNames)}
    </select>
    <select
      name="list"
      onChange=${selectList}
      onMount=${async () => showListOptions(state.project)}
    >
      ${state.$listOptions}
    </select>
  `;

  return [component, state];
};
