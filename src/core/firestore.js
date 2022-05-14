import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  createUser,
  deleteDocument,
  getCollectionRef,
  getData,
  getDocuments,
  setDocument,
  updateDocument,
} from '../utils/firestore';
import { orderById } from '../utils/misc';
import Label from './classes/Label';
import Project from './classes/Project';
import Subtask from './classes/Subtask';
import Task from './classes/Task';
import TaskList from './classes/TaskList';
import { loadDefaultData } from './main';
import { FIREBASE, PROJECT, TASK } from '../actions';
import Core from '.';

// If there are a lot of subtasks, this might cause significant delay
// so consider rerendering after fetching instead
// like emitting an event
const fetchSubtasks = async (tasks, data) => {
  const queries = tasks.map((task) =>
    query(
      getCollectionRef('Subtasks', Subtask.converter(data)),
      where('parent', '==', task.id)
    )
  );

  const result = await Promise.all(queries.map((q) => getDocs(q)));
  const subtasks = result.map((item) => item?.docs?.map(getData) || []);

  tasks.forEach((task, i) =>
    task.subtasks.add(orderById(subtasks[i], task.__initialSubtasksOrder))
  );
};

export const fetchProjects = async () => {
  const itemsRef = getCollectionRef('Projects', Project.converter());
  const folderRef = doc(getFirestore(), `${Core.state.currentUser}/Projects`);
  const projects = await getDocuments(itemsRef);
  const { order } = (await getDoc(folderRef)).data();

  return orderById(projects, order);
};

export const fetchProjectData = async (id) => {
  const data = {};

  const labelsRef = query(
    getCollectionRef('Labels', Label.converter()),
    where('project', '==', id)
  );
  const listsRef = query(
    getCollectionRef('Lists', TaskList.converter(data)),
    where('project', '==', id)
  );
  const tasksRef = query(
    getCollectionRef('Tasks', Task.converter(data)),
    where('project', '==', id),
    // fetch completed tasks on demand only
    where('completed', '==', false)
  );

  // build the data
  const result = await Promise.all([
    getDocs(labelsRef),
    getDocs(tasksRef),
    getDocs(listsRef),
  ]);

  data.labels = result[0].docs?.map(getData);
  data.tasks = result[1].docs?.map(getData);
  data.lists = result[2].docs?.map(getData);

  await fetchSubtasks(data.tasks, data);

  return data;
};

export const initFirestore = async () => {
  // initialize user
  await createUser(Core.state.currentUser);

  // initialize data
  const defaultData = loadDefaultData();

  defaultData.forEach(async (project) => {
    await setDocument('Projects', project.id, project, Project.converter());

    project.labels.items.forEach(async (label) => {
      await setDocument('Labels', label.id, label, Label.converter());
    });

    project.lists.items.forEach(async (list) => {
      await setDocument('Lists', list.id, list, TaskList.converter());

      list.items.forEach(async (task) => {
        await setDocument('Tasks', task.id, task, Task.converter());

        task.data.subtasks.forEach(async (subtask) => {
          await setDocument(
            'Subtasks',
            subtask.id,
            subtask,
            Subtask.converter()
          );
        });
      });
    });
  });

  // store order of projects
  await setDoc(doc(getFirestore(), `${Core.state.currentUser}/Projects`), {
    order: defaultData.map((project) => project.id),
  });
};

/**
 * Setup all list
 */
export const setupListeners = () => {
  // =====================================================================================
  // Projects
  // =====================================================================================
  const projectRef = doc(getFirestore(), `${Core.state.currentUser}/Projects`);

  Core.event.onSuccess(PROJECT.ADD, async (data) => {
    await setDocument('Projects', data.id, data.toFirestore());
    await updateDoc(projectRef, { order: arrayUnion(data.id) });

    data.labels.items.forEach(async (label) => {
      await setDocument('Labels', label.id, label.toFirestore());
    });
    data.lists.items.forEach(async (list) => {
      await setDocument('Lists', list.id, list.toFirestore());
    });

    Core.data.root.add(data);
  });

  Core.event.on(`${PROJECT.REMOVE}:timeout`, async (data) => {
    // delete from cache
    Core.data.root.delete(data.id);

    await deleteDocument('Projects', data.id);
    await updateDoc(projectRef, { order: arrayRemove(data.id) });
  });

  Core.event.onSuccess(PROJECT.MOVE, async () =>
    updateDoc(projectRef, {
      order: Core.main.getAllProjects().map((item) => item.id),
    })
  );

  Core.event.onSuccess(PROJECT.UPDATE, async (data) =>
    updateDocument('Projects', data.id, data.toFirestore())
  );

  // =====================================================================================
  // Lists
  // =====================================================================================
  Core.event.onSuccess(
    [PROJECT.LISTS.ADD, PROJECT.LISTS.UPDATE],
    async (data) => setDocument('Lists', data.id, data.toFirestore())
  );

  Core.event.on(`${PROJECT.LISTS.REMOVE}:timeout`, async (data) =>
    deleteDocument('Lists', data.id)
  );

  Core.event.onSuccess(
    [PROJECT.LISTS.ADD, PROJECT.LISTS.REMOVE, PROJECT.LISTS.MOVE],
    async (data) => {
      const project = Core.main.getProject(data.project);
      // update order
      await updateDocument('Projects', project.id, project.toFirestore());
    }
  );

  // =====================================================================================
  // Labels
  // =====================================================================================
  Core.event.onSuccess(
    [PROJECT.LABELS.ADD, PROJECT.LABELS.UPDATE],
    async (data) => {
      setDocument('Labels', data.id, data.toFirestore());
    }
  );

  Core.event.onSuccess(PROJECT.LABELS.REMOVE, async (data) =>
    deleteDocument('Labels', data.id)
  );

  // =====================================================================================
  // Tasks
  // =====================================================================================
  Core.event.onSuccess([TASK.ADD, TASK.UPDATE], async (data) =>
    setDocument('Tasks', data.id, data.toFirestore())
  );

  // transfer has a different return value for TASK
  Core.event.onSuccess(TASK.TRANSFER, async (data) => {
    const { result, type, changes } = data;

    if (type === 'list') {
      changes.project = { to: changes.project, from: changes.project };
    }

    // remove from old location
    await updateDocument('Lists', changes.list.from, {
      tasks: arrayRemove(result.id),
    });

    switch (type) {
      case 'list':
      case 'project':
        await updateDocument('Tasks', result.id, result.toFirestore());

        await updateDocument(
          'Lists',
          changes.list.to,
          Core.main.getList(changes.project.to, changes.list.to).toFirestore()
        );

        break;

      case 'task':
        // delete original document
        await deleteDocument('Tasks', result.id);
        // create new one in a different collection
        await setDocument('Subtasks', result.id, result.toFirestore());

        await updateDocument(
          'Tasks',
          changes.task.to,
          Core.main
            .getTask(changes.project, changes.list.to, changes.task.to)
            .toFirestore()
        );

        break;
      default:
        throw new Error('Type must be either project, list, or task');
    }
  });

  // we expect transfer to not work if target is not fetched
  Core.event.onError(TASK.TRANSFER, async ({ payload: data }) => {
    let { type, project, list, task: id } = data; //eslint-disable-line
    if (type === 'list') {
      project = { from: data.project, to: data.project };
    }

    // remove task from project
    if (
      type === 'project' &&
      Core.data.fetched.projects.includes(project.from)
    ) {
      Core.event.emit(TASK.REMOVE, {
        project: project.from,
        list: list.from,
        task: id,
      });
    }

    await updateDocument('Tasks', id, {
      project: project.to,
      list: list.to,
    });

    await updateDocument('Lists', list.from, {
      tasks: arrayRemove(id),
    });

    await updateDocument('Lists', list.to, {
      tasks: arrayUnion(id),
    });
  });

  Core.event.on(`${TASK.REMOVE}:timeout`, async (data) =>
    deleteDocument('Tasks', data.id)
  );

  Core.event.onSuccess([TASK.ADD, TASK.REMOVE, TASK.MOVE], async (data) => {
    const list = Core.main.getList(data.project, data.list);
    await updateDocument('Lists', list.id, list.toFirestore());
  });

  // task and subtask share TASK.LABELS.*
  Core.event.onSuccess(
    [TASK.LABELS.ADD, TASK.LABELS.REMOVE],
    async ({ type, result }) => {
      // eslint-disable-next-line
      const name = type[0].toUpperCase() + type.slice(1) + 's';

      setDocument(name, result.id, result.toFirestore());
    }
  );

  // =====================================================================================
  // Subtasks
  // =====================================================================================
  Core.event.onSuccess(
    [TASK.SUBTASKS.ADD, TASK.SUBTASKS.UPDATE],
    async (data) => {
      setDocument('Subtasks', data.id, data.toFirestore());
    }
  );

  Core.event.onSuccess(TASK.SUBTASKS.TRANSFER, async (data) => {
    const { result, type, changes } = data;

    if (type === 'list') {
      // delete original document
      await deleteDocument('Subtasks', result.id);

      // create new one in a different collection
      await setDocument('Tasks', result.id, result.toFirestore());

      // update order in old and new location
      await updateDocument('Tasks', changes.task, {
        subtasks: arrayRemove(result.id),
      });
      await updateDocument(
        'Lists',
        changes.list.to,
        Core.main.getList(changes.project, changes.list.to).toFirestore()
      );
    } else {
      await updateDocument('Subtasks', result.id, result.toFirestore());
      // update order in old and new location
      await updateDocument('Tasks', changes.task.from, {
        subtasks: arrayRemove(result.id),
      });
      await updateDocument(
        'Tasks',
        changes.task.to,
        Core.main
          .getTask(changes.project, changes.list.to, changes.task.to)
          .toFirestore()
      );
    }
  });

  Core.event.on(`${TASK.SUBTASKS.REMOVE}:timeout`, async (data) =>
    deleteDocument('Subtasks', data.id)
  );

  Core.event.onSuccess(
    [TASK.SUBTASKS.ADD, TASK.SUBTASKS.REMOVE, TASK.SUBTASKS.MOVE],
    async (data) => {
      const task = Core.main.getTask(data.project, data.list, data.parent);
      await updateDocument('Tasks', task.id, task.toFirestore());
    }
  );

  // =====================================================================================
  // Miscellaneous
  // =====================================================================================
  Core.event.on(FIREBASE.TASK.FETCH_COMPLETED, async (data) => {
    // only fetch for the first time
    if (Core.data.fetched.lists.includes(data.list)) return;

    const project = Core.main.getProject(data.project);
    const list = project.getList(data.list);

    const completedTasks = await getDocuments(
      query(
        getCollectionRef('Tasks', Task.converter()),
        where('project', '==', data.project),
        where('list', '==', data.list),
        where('completed', '==', true),
        // do not fetch recently marked completed tasks
        where('completionDate', '<=', project.lastFetched),
        limit(25)
      )
    );

    // fetch subtasks
    await fetchSubtasks(completedTasks, data);
    list.add(completedTasks || []);

    Core.data.fetched.lists.push(data.list);
  });
};
