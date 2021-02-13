const images = {
   edit: `<img src="icons/edit.svg" class="edit" alt="edit" />`,
   tag: `<img src="icons/tag.svg" class="icon" alt="tag" />`,
   details: `<img src="icons/justify.svg" class="icon" alt="details" />`,
   calendar: `<img src="icons/date.svg" class="icon" alt="calendar" />`,
   delete: `<img src="icons/delete.svg" class="delete" alt="delete" />`,
   checkmark: `<img src="icons/check-mark.svg" class="checkmark" alt="checkmark" />`,
};

const Icons = (iconName) => {
   return images[iconName];
};

export default Icons;
