import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
import { useRoot } from '../core/hooks';

export const useSelectLocation = (project = {}, list = {}) => {
  const [root, unsubscribe] = useRoot();
  const [state] = createHook({
    selectedProject: project.id,
    selectedList: list.id,
  });

  const renderOptions = (itemList, isProject = true) => {
    const defaultValue = isProject ? state.selectedProject : state.selectedList;

    return html`
      ${isProject
        ? html`<option
            hidden
            disabled
            value
            ${{ selected: !defaultValue }}
          ></option>`
        : ''}
      ${itemList.map(
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
    state.selectedList = e.target.value;
    list.onChange?.(e);
  };

  const selectProject = (e) => {
    state.selectedProject = e.target.value;
    state.selectedList = e.target.nextElementSibling.value;
    project.onChange?.(e);
  };

  const showListOptions = (projectId) => {
    if (!projectId) return [];

    return renderOptions(Core.main.getListDetails(projectId), false);
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
        $children: state.$selectedProject(showListOptions),
      }}
    ></select>
  `;

  return [component, state];
};
