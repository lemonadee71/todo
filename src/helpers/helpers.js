const $ = (query) => {
  let isId = query.includes('#');
  let isAll = query.includes('--g');
  let isDataAttr = query.includes('--data');

  if (isId) {
    return document.getElementById(query.replace('#', ''));
  } else if (isAll) {
    return document.querySelectorAll(query.replace('--all', ''));
  } else if (isDataAttr) {
    let [type, value] = query.replace('--data-', '').split('=');
    return document.querySelector(`[data-${type}="${value}"]`);
  }

  return document.querySelector(query);
};

const clear = (element) => {
  [...element.children].map((child) => child.remove());
};

const hide = (element) => {
  element.style.display = 'none';
};

const show = (element) => {
  element.style.display = 'block';
};

const closeModal = (e) => {
  hide($('.modal-backdrop'));
  clear($('#modal-content'));
  e.stopPropagation();
};

const changeModalContent = (newContent) => {
  let modalContent = $('#modal-content');
  clear(modalContent);
  modalContent.appendChild(newContent);
};

export { clear, hide, show, closeModal, changeModalContent };
export default $;
