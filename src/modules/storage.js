// Example watch(allProjects).forChangesOn(items)
// watch(project).forChangesOn(project.items)
// watch(task).forChangesOn('all')

const watchForChanges = (target, prop) => {
   target[prop] = new Proxy(target[prop], {});
};

const watch = (target) => {
   return {
      forChangesOn: (prop) => {
         target[prop] = new Proxy(target, {});
      },
   };
};

const Storage = () => {
   let data = window.localStorage;
   let key = 'data';

   const getData = () => JSON.parse(data.getItem(key));

   const setKey = (newKey) => {
      key = newKey;
   };

   const store = (newData) => {
      let storedData = getItems();

      if (storedData && Array.isArray(storedData)) {
         storedData.push(newData);
      }

      data.setItem(key, JSON.stringify(storedData || [newData]));
   };

   const update = () => {
      data.setItem(key, JSON.stringify(storedData));
   };

   return {
      setKey,
   };
};

export default Storage;
