import Component from '../component';

const ProjectLi = (proj, { selectProject }) => {
  return Component.parseString`
  <li id=${proj.id} ${{
    onClick: () => {
      selectProject(proj.id);
    },
  }}>
    ${proj.name}
  </li>
  `;
};

export default ProjectLi;
