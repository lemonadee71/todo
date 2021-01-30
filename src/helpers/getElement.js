const $ = (query) => {
  let queryIsId = query.includes('#');
  let queryIsAll = query.includes('--all');

  if (queryIsId) {
    return document.getElementById(query.replace('#', ''));
  } else if (queryIsAll) {
    return document.querySelectorAll(query.replace('--all', ''));
  }

  return document.querySelector(query);
};

export default $;
