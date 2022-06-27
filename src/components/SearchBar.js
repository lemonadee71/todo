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

  const renderResults = (items) =>
    items.length
      ? items
          .map((task, i) =>
            // the threshold for best match is different
            SearchResult(task.data, i === 0 && task.score > 0.65)
          )
          .map((item) => render(item))
      : render(
          html`
            <p key="no-results" class="px-3 py-4 text-sm text-gray-400">
              No results found
            </p>
          `
        );

  const updateResults = (query) => {
    const tasks = Core.main.getAllTasks();

    state.results = tasks
      .map((task) => ({
        data: task,
        score: matches(query, task, state.isComparisonAND ? 'AND' : 'OR'),
      }))
      .filter((task) => task.score > 0)
      .sort((a, b) => b.score - a.score); // sort in ascending
  };

  const toggleFocus = (e) => {
    const isFocused = e.target === document.activeElement;
    state.showResults = isFocused && e.target.value.trim();
  };

  const toggleSearchMode = () => {
    state.isComparisonAND = !state.isComparisonAND;
    updateResults(state.query);
  };

  const clearInput = () => {
    $('#search').value = '';
  };

  const onChange = (e) => {
    state.query = e.target.value.trim();
    updateResults(state.query);
    toggleFocus(e);
  };

  return html`
    <div
      class="group relative col-span-2 xs:col-span-1 xs:col-start-2 xs:row-start-1 sm:w-3/4 sm:max-w-2xl md:w-1/2 md:ml-56"
    >
      <div
        class="justify-self-stretch px-3 flex items-center gap-1 sm:gap-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-100 dark:hover:bg-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-400"
      >
        <label for="search">
          ${SearchIcon({
            cls: 'stroke-gray-600 group-hover:stroke-gray-700',
            size: 20,
            decorative: true,
          })}
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
          ${CloseIcon({
            cls: 'stroke-gray-600 hover:stroke-red-500',
            size: 20,
            id: 'clear-search',
            title: 'Clear search input',
          })}
        </button>
      </div>
      <div
        is-list
        class="absolute top-8 left-0 right-0 p-1 divide-y-2 divide-gray-200 rounded-b-lg drop-shadow-lg bg-white dark:bg-[#272727] dark:divide-[#272727] ${state.$showResults(
          (value) => (value ? 'block' : 'hidden')
        )}"
      >
        ${state.$results(renderResults)}
      </div>
    </div>
  `;
};

export default SearchBar;
