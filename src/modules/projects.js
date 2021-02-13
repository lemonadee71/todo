import { compareAsc } from 'date-fns';
import List from '../classes/List.js';
import $, {
   clear,
   changeModalContent,
   show,
   closeModal,
   append,
   remove,
   clearTasks,
} from '../helpers/helpers';
import Component from '../helpers/component';
import ProjectListItem from '../components/ProjectListItem';
import Task from '../classes/Task.js';
import CreateTaskForm from '../components/CreateTaskForm.js';
import {
   completedTasks,
   currentTasks,
   modal,
   newProjectInput,
   newTaskForm,
   newTaskFormNotes,
   newTaskFormDueDate,
   newTaskFormTitle,
   tasksList,
   userProjects,
} from '../helpers/selectors.js';
import NoTasksMessage from '../components/NoTasksMessage.js';
import { defaultProjects } from '../helpers/defaults.js';
import TaskItem from '../components/TaskItem';

const uncategorizedTasks = new List('uncategorized', 'project');
const allProjects = new List('all', 'root', [
   uncategorizedTasks,
   ...defaultProjects,
]);

let currentSelectedProj = uncategorizedTasks.id;

const getCurrentSelectedProj = () => currentSelectedProj;

const getAllProjects = () => allProjects.items;

const _segregateTasks = (tasks) => {
   return [
      tasks.filter((task) => !task.completed),
      tasks.filter((task) => task.completed),
   ];
};

const _getProjectTasks = (id) => {
   currentSelectedProj = id;
   return allProjects.getItem((proj) => proj.id === id).items;
};

const _getAllTasks = () => {
   currentSelectedProj = '';
   return [...allProjects.items].map((proj) => proj.items).flat();
};

const _addProject = (projName) => {
   let newProject = new List(projName, 'project');
   allProjects.addItem(newProject);
   return newProject;
};

const _deleteProject = (id) => {
   allProjects.removeItems((proj) => proj.id === id);
};

const _addTask = (task) => {
   let location = currentSelectedProj || uncategorizedTasks.id;
   let project = allProjects.getItem((proj) => proj.id === location);
   project.addItem(task);
};

const deleteTask = (task) => {
   let project = allProjects.getItem((proj) => proj.id === task.location);
   project.removeItems((item) => item.id === task.id);
};

const transferTask = (id, prevList, newList) => {
   let task = allProjects
      .getItem((proj) => proj.id === prevList)
      .extractItem((task) => task.id === id);

   allProjects.getItem((proj) => proj.id === newList).addItem(task);
};

// const getDueToday = () => {
//   return [...allProjects]
//     .map((proj) => proj.items)
//     .flat()
//     .filter((task) => task.dueDate === '');
// };

// const getDueThisWeek = () => {
//   return [...allProjects]
//     .map((proj) => proj.items)
//     .flat()
//     .filter((task) => task.dueDate === '');
// };

// const getUpcoming = () => {
//   return [...allProjects]
//     .map((proj) => proj.items)
//     .flat()
//     .filter((task) => task.dueDate === '');
// };

const getProjectsDetails = () => {
   let projects = allProjects.filterItems(
      (proj) => proj.id !== uncategorizedTasks.id
   );

   return projects.length
      ? projects.map((proj) => {
           return {
              id: proj.id,
              name: proj.name,
           };
        })
      : [];
};

// Sidenav
const _renderTasks = (tasks) => {
   clearTasks();

   // let [current, completed] = _segregateTasks(tasks);
   tasks.forEach((task) => {
      if (task.completed) {
         append(TaskItem({ task })).to($(completedTasks));
      } else {
         append(TaskItem({ task })).to($(currentTasks));
      }
   });
};

const _renderNoTasksMessage = () => {
   clearTasks();

   if (!$('#no-tasks')) {
      $(tasksList).prepend(NoTasksMessage());
   }
};

const selectAllTasks = () => {
   let tasks = _getAllTasks();
   tasks.length ? _renderTasks(tasks) : _renderNoTasksMessage();
};

const selectProject = (e) => {
   let tasks = _getProjectTasks(e.currentTarget.id);
   tasks.length ? _renderTasks(tasks) : _renderNoTasksMessage();
};

const removeProject = (e) => {
   e.stopPropagation();
   let projListItem = e.currentTarget.parentElement;

   // Crude implementation for now
   let tasks = _getProjectTasks(projListItem.id);
   tasks.map((task) => {
      let taskItem = $(`#${task.id}`);
      if (taskItem) {
         let list = task.completed ? completedTasks : currentTasks;
         remove(taskItem).from($(list));
      }
   });

   _deleteProject(projListItem.id);
   remove(projListItem).from($(userProjects));
};

const createNewProject = (e) => {
   e.preventDefault();
   let newProject = _addProject($(newProjectInput).value);

   append(
      Component.render(
         ProjectListItem(newProject, {
            clickHandler: selectProject,
            deleteHandler: removeProject,
         })
      )
   ).to($(userProjects));
   e.target.reset();
};

// Add Task button
const createNewTask = (e) => {
   e.preventDefault();
   let title = $(newTaskFormTitle).value;
   let notes = $(newTaskFormNotes).value;
   let dueDate = $(newTaskFormDueDate).value;
   let location = currentSelectedProj || uncategorizedTasks.id;

   let task = new Task({ title, notes, dueDate, location });

   _addTask(task);
   append(TaskItem({ task })).to($(currentTasks));
   _destroyForm();
};

const showCreateTaskForm = () => {
   changeModalContent(
      Component.render(CreateTaskForm({ onSubmit: createNewTask }))
   );
   show($(modal));
};

const _destroyForm = () => {
   $(newTaskForm).removeEventListener('submit', createNewTask);
   closeModal();
};

export {
   uncategorizedTasks,
   showCreateTaskForm,
   createNewProject,
   selectProject,
   removeProject,
   selectAllTasks,
   getProjectsDetails,
   getCurrentSelectedProj,
   getAllProjects,
   transferTask,
   deleteTask,
};
