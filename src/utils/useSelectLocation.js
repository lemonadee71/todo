import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
import { useRoot } from '../core/hooks';

export const useSelectLocation = (onChange, data = {}) => {
  const [root, unsubscribe] = useRoot();
  const [state] = createHook({
    project: data.project,
    list: data.list,
  });

  const renderOptions = (items, isProject = true) => {
    const defaultValue = isProject ? state.project : state.list;

    return html`
      ${isProject
        ? html`<option
            hidden
            disabled
            value
            ${{ selected: !defaultValue }}
          ></option>`
        : ''}
      ${items.map(
        (item) =>
          html`
            <option
              value="${item.id}"
              ${{ selected: item.id === defaultValue }}
            >
              ${item.name}
            </option>
          `
      )}
    `;
  };

  const selectList = (e) => {
    state.list = e.target.value;
    onChange?.(e, { ...state });
  };

  const selectProject = (e) => {
    state.project = e.target.value;
    state.list = e.target.nextElementSibling.value;
    onChange?.(e, { ...state });
  };

  const showListOptions = (projectId) => {
    if (!projectId) return [];

    return renderOptions(Core.main.getLists(projectId), false);
  };

  const component = html`
    <select
      name="project"
      ${{
        onDestroy: unsubscribe,
        onChange: selectProject,
        $children: root.$projects(renderOptions),
      }}
    ></select>
    <select
      name="list"
      ${{
        onChange: selectList,
        $children: state.$project(showListOptions),
      }}
    ></select>
  `;

  return [component, state];
};
