import { createHook, html, render } from 'poor-man-jsx';
import { CloseIcon, SearchIcon } from '../assets/icons';
import Core from '../core';
import { debounce } from '../utils/delay';
import { $ } from '../utils/query';
import { matches } from '../utils/search';
import SearchResult from './SearchResult';

const SearchBar = () => {
  const [state] = createHook({
    query: '',
    showResults: false,
    results: [],
    isComparisonAND: true,
  });

  const updateResults = (query) => {
    const tasks = Core.main.getAllTasks();

    const items = tasks
      .map((task) => ({
        data: task,
        score: matches(query, task, state.isComparisonAND ? 'AND' : 'OR'),
      }))
      .filter((task) => task.score > 0)
      .sort((a, b) => b.score - a.score); // sort in ascending

    return items.length
      ? items
          .map((task, i) =>
            // the threshold for best match is different
            SearchResult(task.data, i === 0 && task.score > 0.5)
          )
          .map((item) => render(item))
      : render(
          html`
            <p key="no-results" class="px-3 py-4 text-sm text-gray-400">
              No results found
            </p>
          `
        );
  };

  const toggleFocus = (e) => {
    const isFocused = e.target === document.activeElement;
    state.showResults = isFocused && e.target.value.trim();
  };

  // BUG: Only updates the results if we typed again after clicking the button
  //      the behavior should be to update the results on button clicked
  const toggleSearchMode = () => {
    state.isComparisonAND = !state.isComparisonAND;
    updateResults(state.query);
  };

  const clearInput = () => {
    $('#search').value = '';
  };

  const onChange = (e) => {
    state.query = e.target.value.trim();
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
          class="text-xs text-gray-400 px-1 py-0.5 bg-transparent rounded-md hover:text-gray-600 invisible group-focus-within:visible"
          onClick=${toggleSearchMode}
        >
          ${state.$isComparisonAND((value) => (value ? 'AND' : 'OR'))}
        </button>
        <button
          class="invisible group-focus-within:visible"
          onClick=${clearInput}
        >
          ${CloseIcon('stroke-gray-600 hover:stroke-red-500', 20)}
        </button>
      </div>
      <div
        is-list
        class="absolute top-8 left-0 right-0 p-1 divide-y-2 divide-gray-200 rounded-b-lg drop-shadow-lg bg-white dark:bg-[#272727] dark:divide-[#272727] ${state.$showResults(
          (value) => (value ? 'block' : 'hidden')
        )}"
      >
        ${state.$query(updateResults)}
      </div>
    </div>
  `;
};

export default SearchBar;
