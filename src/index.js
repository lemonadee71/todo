import Component from './component';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import {
  createNewProject,
  selectProject,
  selectAllTasks,
  getProjectsDetails,
} from './ProjectController';

import { compareAsc, format } from 'date-fns';

const App = () => {
  return Component.createFromString(
    ...Array.from(Component.parseString`
      ${Header()}
      ${Sidebar({
        selectProject,
        createNewProject,
        getAllTasks: selectAllTasks,
        projects: getProjectsDetails(),
      })}
      ${MainContent()}
      ${Footer()}
    `)
  );
};

document.body.prepend(App());
