import {
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  getCollectionRef,
  getData,
  getDocumentRef,
  getDocuments,
} from '../utils/firestore';
import Label from './classes/Label';
import Project from './classes/Project';
import Subtask from './classes/Subtask';
import Task from './classes/Task';
import TaskList from './classes/TaskList';
import { loadDefaultData } from './main';
import { FIREBASE, PROJECT, TASK } from './actions';
import Core from '.';

const fetchSubtasksForTask = async (task, data) => {
  const subtasks = await getDocuments(
    query(
      getCollectionRef('Subtasks', Subtask.converter(data)),
      where('parent', '==', task.id)
    )
  );
  task.subtasks.add(subtasks || []);
};

export const fetchProject = async (projectId) => {
  const data = {};

  // refs
  const projectsRef = query(
    getCollectionRef('Projects', Project.converter(data)),
    where('id', '==', projectId)
  );
  const labelsRef = query(
    getCollectionRef('Labels', Label.converter()),
    where('project', '==', projectId)
  );
  const listsRef = query(
    getCollectionRef('Lists', TaskList.converter(data)),
    where('project', '==', projectId)
  );
  const tasksRef = query(
    getCollectionRef('Tasks', Task.converter(data)),
    where('project', '==', projectId),
    where('completed', '==', false)
  );

  // do an initial fetch to build the data
  const result = await Promise.all([
    getDocs(labelsRef),
    getDocs(tasksRef),
    getDocs(listsRef),
  ]);

  data.labels = result[0].docs?.map(getData);
  data.tasks = result[1].docs?.map(getData);
  data.lists = result[2].docs?.map(getData);

  // this is to only fetch substasks for uncompleted tasks
  // to avoid unnecessary reads
  data.tasks.forEach(async (task) => fetchSubtasksForTask(task, data));

  return (await getDocuments(projectsRef))[0];
};

export const initFirestore = async () => {
  // initialize user
  await setDoc(doc(getFirestore(), Core.state.currentUser, 'data'), {
    created: Date.now(),
  });

  // initialize data
  const defaultData = loadDefaultData();

  defaultData.forEach(async (project) => {
    await setDoc(
      getDocumentRef('Projects', project.id, Project.converter()),
      project
    );

    project.labels.items.forEach(async (label) => {
      await setDoc(
        getDocumentRef('Labels', label.id, Label.converter()),
        label
      );
    });

    project.lists.items.forEach(async (list) => {
      await setDoc(
        getDocumentRef('Lists', list.id, TaskList.converter()),
        list
      );

      list.items.forEach(async (task) => {
        await setDoc(getDocumentRef('Tasks', task.id, Task.converter()), task);

        task.data.subtasks.forEach(async (subtask) => {
          await setDoc(
            getDocumentRef('Subtasks', subtask.id, Subtask.converter(), subtask)
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

export const setupListeners = () => {
  /** Projects */
  const orderRef = doc(getFirestore(), `${Core.state.currentUser}/Projects`);

  Core.event.on(FIREBASE.PROJECT.ADD, async ({ data: { name, order } }) => {
    if (Core.data.projects.find((project) => project.name === name)) {
      throw new Error(`Project with the name "${name}" already exists`);
    }

    if (!name.trim()) throw new Error('Project must have a name');

    const project = new Project({ name });

    await setDoc(getDocumentRef('Projects', project.id), project.toFirestore());

    project.labels.items.forEach(async (label) => {
      await setDoc(getDocumentRef('Labels', label.id), label.toFirestore());
    });
    project.lists.items.forEach(async (list) => {
      await setDoc(getDocumentRef('Lists', list.id), list.toFirestore());
    });

    await setDoc(orderRef, { order: [...order, project.id] });
  });
  // we rely on the actual positions of elements here
  // just update the order; the hook will handle the "projects" update
  Core.event.on(FIREBASE.PROJECT.MOVE, async (data) => setDoc(orderRef, data));
  // update order too after delete
  Core.event.on(FIREBASE.PROJECT.REMOVE, async (data) => {
    await deleteDoc(getDocumentRef('Projects', data.id));
    await setDoc(orderRef, {
      order: Core.data.projects
        .map((project) => project.id)
        .filter((id) => id !== data.id),
    });
  });

  /** Lists */
  Core.event.onSuccess(
    [PROJECT.LISTS.ADD, PROJECT.LISTS.UPDATE],
    async (data) => setDoc(getDocumentRef('Lists', data.id), data.toFirestore())
  );
  Core.event.on(`${PROJECT.LISTS.REMOVE}:timeout`, async (data) =>
    deleteDoc(getDocumentRef('Lists', data.id))
  );
  Core.event.onSuccess(
    [PROJECT.LISTS.ADD, PROJECT.LISTS.REMOVE, PROJECT.LISTS.MOVE],
    async (data) => {
      const proj = Core.main.getProject(data.project);
      await setDoc(getDocumentRef('Projects', proj.id), proj.toFirestore());
    }
  );

  /** Labels */
  Core.event.onSuccess(
    [PROJECT.LABELS.ADD, PROJECT.LABELS.UPDATE],
    async (data) =>
      setDoc(getDocumentRef('Labels', data.id), data.toFirestore())
  );
  Core.event.onSuccess(PROJECT.LABELS.REMOVE, async (data) =>
    deleteDoc(getDocumentRef('Labels', data.id))
  );

  /** Tasks */
  Core.event.onSuccess(
    [TASK.ADD, TASK.UPDATE, TASK.LABELS.ADD, TASK.LABELS.REMOVE],
    // task and subtask share TASK.LABELS.*
    async (data) => setDoc(getDocumentRef('Tasks', data.id), data.toFirestore())
  );
  // transfer has a different return value for TASK
  Core.event.onSuccess(TASK.TRANSFER, async (data) => {
    const { result, type, changes } = data;

    if (type === 'list') {
      changes.project = { to: changes.project, from: changes.project };
    }

    switch (type) {
      case 'list':
      case 'project':
        await setDoc(getDocumentRef('Tasks', result.id), result.toFirestore());

        await setDoc(
          getDocumentRef('Lists', changes.list.from),
          Core.main
            .getList(changes.project.from, changes.list.from)
            .toFirestore()
        );

        await setDoc(
          getDocumentRef('Lists', changes.list.to),
          Core.main.getList(changes.project.to, changes.list.to).toFirestore()
        );

        break;

      case 'task':
        // delete original document
        await deleteDoc(getDocumentRef('Tasks', result.id));
        // create new one in a different collection
        await setDoc(
          getDocumentRef('Subtasks', result.id),
          result.toFirestore()
        );

        // update order in old and new location
        await setDoc(
          getDocumentRef('Lists', changes.list.from),
          Core.main.getList(changes.project, changes.list.from).toFirestore()
        );
        await setDoc(
          getDocumentRef('Tasks', changes.task.to),
          Core.main
            .getTask(changes.project, changes.list.to, changes.task.to)
            .toFirestore()
        );

        break;
      default:
        throw new Error('Type must be either project, list, or task');
    }
  });
  Core.event.on(`${TASK.REMOVE}:timeout`, async (data) =>
    deleteDoc(getDocumentRef('Tasks', data.id))
  );
  Core.event.onSuccess([TASK.ADD, TASK.REMOVE, TASK.MOVE], async (data) => {
    const list = Core.main.getList(data.project, data.list);
    await setDoc(getDocumentRef('Lists', list.id), list.toFirestore());
  });

  /** Subtasks */
  Core.event.onSuccess(
    [TASK.SUBTASKS.ADD, TASK.SUBTASKS.UPDATE],
    async (data) =>
      setDoc(getDocumentRef('Subtasks', data.id), data.toFirestore())
  );
  Core.event.onSuccess(TASK.SUBTASKS.TRANSFER, async (data) => {
    const { result, type, changes } = data;

    if (type === 'list') {
      // delete original document
      await deleteDoc(getDocumentRef('Subtasks', result.id));

      // create new one in a different collection
      await setDoc(getDocumentRef('Tasks', result.id), result.toFirestore());

      // update order in old and new location
      await setDoc(
        getDocumentRef('Tasks', changes.task),
        Core.main
          .getTask(changes.project, changes.list.from, changes.task)
          .toFirestore()
      );
      await setDoc(
        getDocumentRef('Lists', changes.list.to),
        Core.main.getList(changes.project, changes.list.to).toFirestore()
      );
    } else {
      await setDoc(getDocumentRef('Subtasks', result.id), result.toFirestore());
      // update order in old and new location
      await setDoc(
        getDocumentRef('Tasks', changes.task.from),
        Core.main
          .getTask(changes.project, changes.list.from, changes.task.from)
          .toFirestore()
      );
      await setDoc(
        getDocumentRef('Tasks', changes.task.to),
        Core.main
          .getTask(changes.project, changes.list.to, changes.task.to)
          .toFirestore()
      );
    }
  });
  Core.event.on(`${TASK.SUBTASKS.REMOVE}:timeout`, async (data) =>
    deleteDoc(getDocumentRef('Subtasks', data.id))
  );
  Core.event.onSuccess(
    [TASK.SUBTASKS.ADD, TASK.SUBTASKS.REMOVE, TASK.SUBTASKS.MOVE],
    async (data) => {
      const task = Core.main.getTask(data.project, data.list, data.parent);
      await setDoc(getDocumentRef('Tasks', task.id), task.toFirestore());
    }
  );

  /** Others */
  Core.event.on(FIREBASE.TASKS.FETCH_COMPLETED, async (data) => {
    // only fetch for the first time
    if (Core.data.fetchedLists.includes(data.list)) return;

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
    completedTasks.forEach(async (task) => fetchSubtasksForTask(task));
    list.add(completedTasks || []);

    Core.data.fetchedLists.push(data.list);
  });
};
