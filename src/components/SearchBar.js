import { createHook, html, render } from 'poor-man-jsx';
import { compareTwoStrings } from 'string-similarity';
import { CloseIcon, SearchIcon } from '../assets/icons';
import Core from '../core';
import { debounce } from '../utils/delay';
import { $ } from '../utils/query';
import TaskSearchResult from './TaskSearchResult';

const SearchBar = () => {
  const [state] = createHook({
    showResults: false,
    results: [],
  });

  const toggleFocus = (e) => {
    const isFocused = e.target === document.activeElement;
    state.showResults = isFocused && e.target.value.trim();
  };

  const clearInput = () => {
    $('#search').value = '';
  };

  const onChange = (e) => {
    const tasks = Core.main.getAllTasks();

    state.results = tasks.filter(
      // case sensitive
      (task) => compareTwoStrings(task.title, e.target.value.trim()) > 0.4
    );

    toggleFocus(e);
  };

  // BUG: Not responsive for mobile view (before xs breakpoint)
  return html`
    <div class="group relative max-w-2xl flex-1">
      <div
        class="px-3 flex justify-start items-center gap-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-100 dark:hover:bg-gray-200 focus-within:bg-white focus-within:hover:bg-white focus-within:ring-2 focus-within:ring-sky-400"
      >
        <label for="search">
          ${SearchIcon('stroke-gray-600 group-hover:stroke-gray-700', 20)}
        </label>
        <input
          class="flex-1 py-0.5 text-black bg-inherit focus:outline-none"
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          onFocus=${toggleFocus}
          onBlur=${debounce(toggleFocus, 150)}
          onInput=${debounce(onChange, 200)}
        />
        <button
          class="invisible group-focus-within:visible"
          onClick=${clearInput}
        >
          ${CloseIcon('stroke-gray-600 hover:stroke-red-500', 20)}
        </button>
      </div>
      <div
        class="absolute top-8 left-0 right-0 p-1 space-y-1 rounded-b-lg drop-shadow-lg bg-white dark:bg-[#272727]
         ${state.$showResults((value) => (value ? 'block' : 'hidden'))}"
      >
        ${state.$results((items) =>
          items.length
            ? items.map(TaskSearchResult).map((item) => render(item))
            : render(
                html`
                  <p class="px-3 py-4 text-sm text-gray-400">
                    No results found
                  </p>
                `
              )
        )}
      </div>
    </div>
  `;
};

export default SearchBar;
