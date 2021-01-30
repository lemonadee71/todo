import { v4 as uuidv4 } from 'uuid';

const List = (name, type, defaultItems = []) => {
  let items = [...defaultItems];
  let length = 0;
  let listType = type;
  let listName = name;
  let id = uuidv4();

  const addItem = (item) => {
    if (Array.isArray(item)) {
      items.push(...item);
    } else {
      items.push(item);
    }
    length = items.length;
  };

  const getItem = (condition) => {
    return items.find(condition);
  };

  const removeItems = (condition) => {
    items = items.filter((item) => condition(item));
    length = items.length;
  };

  const removeAll = () => {
    items = [];
    length = 0;
  };

  const sortItems = (condition) => {
    items.sort((a, b) => {
      if (condition(a, b)) return 1;
      return -1;
    });
  };

  const filterItems = (condition) => {
    return items.filter((item) => condition(item));
  };

  let listObj = {
    id,
    listName,
    listType,
    items,
    addItem,
    getItem,
    removeItems,
    removeAll,
    sortItems,
    filterItems,
  };

  Object.defineProperty(listObj, 'id', {
    writable: false,
  });
  Object.defineProperty(listObj, 'listName', {
    writable: false,
  });
  Object.defineProperty(listObj, 'listType', {
    writable: false,
  });
  Object.defineProperty(listObj, 'items', {
    writable: false,
  });

  return listObj;
};

export default List;
