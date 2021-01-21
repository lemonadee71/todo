import { compareAsc } from 'date-fns';
import List from './list.js';

// Work on displaying tasks in a selected project
// Add a function that process drop events
const ProjectController = (() => {
  const allProjects = List('all');
  const labels = List('labels', ['low', 'medium', 'high']);

  let currentSelectedProj = allProjects.id;

  const transferTask = (id, target) => {
    task = allProjects
      .getItem((proj) => proj.id === currentSelectedProj)
      .getItem((task) => task.id === id);

    allProjects.getItem((proj) => proj.id === target).addItem(task);
  };

  const selectProject = (id) => {
    currentSelectedProj = id;
    return allProjects.getItem((proj) => proj.id === id);
  };

  const addProject = (projName) => {
    allProjects.addItem(List(projName));
  };

  const addTask = (task) => {
    allProjects
      .getItem((proj) => proj.id === currentSelectedProj)
      .addItem(task);
  };

  const getAllTasks = () => {
    return [...allProjects].flat();
  };

  const getDueToday = () => {
    return [...allProjects]
      .flat()
      .filter((task) => task.dueDate === '');
  };

  const getDueThisWeek = () => {
    return [...allProjects]
      .flat()
      .filter((task) => task.dueDate === '');
  };

  const getUpcoming = () => {
    return [...allProjects]
      .flat()
      .filter((task) => task.dueDate === '');
  };

  return {
    selectProject,
    getDueToday,
    getDueThisWeek,
    getUpcoming,
  };
})();

export default ProjectController;
