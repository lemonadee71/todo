import { html } from 'poor-man-jsx';
import Core from '../core';
import { FIREBASE, PROJECT } from '../core/actions';
import { isGuest } from '../utils/auth';
import { showToast } from '../utils/showToast';
import { useUndo } from '../utils/undo';
import Toast from './Toast';

const ProjectLink = (data) => {
  let isCancelled = false;

  const localDelete = useUndo({
    type: PROJECT,
    text: 'Project removed',
    payload: { project: data.id },
  });

  // custom undo to work with firestore
  const firestoreDelete = (e) => {
    const parent = e.target.parentElement;
    parent.style.display = 'none';

    const toast = showToast({
      delay: 3000,
      className: 'custom-toast',
      close: true,
      callback: () => {
        if (!isCancelled) {
          Core.event.emit(FIREBASE.PROJECT.REMOVE, { id: parent.dataset.id });
          parent.remove();
        }
      },
      node: Toast('Project removed', {
        text: 'Undo',
        callback: () => {
          parent.style.removeProperty('display');

          isCancelled = true;
          toast.hideToast();
        },
      }),
    });
  };

  const deleteProject = isGuest() ? firestoreDelete : localDelete;

  return html`
    <li ignore="style" data-id="${data.id}">
      <a is="navigo-link" href="${`/app/${data.link}`}">{% ${data.name} %}</a>
      <button ${{ onClick: deleteProject }}>Delete</button>
    </li>
  `;
};

export default ProjectLink;
