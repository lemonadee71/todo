import { apply, createHook, html } from 'poor-man-jsx';
import Core from '../core';
import { debounce } from '../utils/delay';
import { createRovingTabFns } from '../utils/keyboard';
import { matches } from '../utils/search';
import SearchResult from './SearchResult';

/**
 * TODO: Copy behavior of MDN's search bar
 *
 * -[x] Search preview isn't hidden as long as focus is inside the component
 * -[x] Ctrl + K focuses the search bar
 * -[x] Up/Down arrow navigates the search results
 * -[] Clicking enter opens a modal that displays the results
 * -[] If limit is reached in preview, clicking 'more' will open a modal
 */
const SearchBar = () => {
  const refs = {};

  const state = createHook({
    query: '',
    showResults: false,
    results: [],
    isComparisonAND: true,
  });

  const renderResults = (items) =>
    items.length
      ? items.map((task, i) =>
          // the threshold for best match is different
          SearchResult(task.data, i === 0 && task.score > 0.65)
        )
      : html`
          <p key="no-results" class="px-3 py-4 text-sm text-gray-400">
            No results found
          </p>
        `;

  const updateResults = (query) => {
    state.results = Core.main
      .getAllTasks()
      .map((task) => ({
        data: task,
        score: matches(query, task, state.isComparisonAND ? 'AND' : 'OR'),
      }))
      .filter((task) => task.score > 0)
      .sort((a, b) => b.score - a.score); // sort in ascending
  };

  const toggleFocus = () => {
    state.showResults =
      refs.self.contains(document.activeElement) && refs.input.value.trim();
  };

  const toggleSearchMode = () => {
    state.isComparisonAND = !state.isComparisonAND;
    updateResults(state.query);
  };

  const clearState = () => {
    state.query = '';
    state.results = [];
    state.showResults = false;
  };

  const onChange = (e) => {
    state.query = e.target.value.trim();
    updateResults(state.query);
    toggleFocus();
  };

  const onNavigate = (e) => {
    if (e.key === 'Tab') toggleFocus();
  };

  const applyNavigation = ({ target }) => {
    const { interact, moveWithin, reset } = createRovingTabFns(target);

    apply(refs.form, { onKeydown: interact });
    apply(target, {
      onKeydown: [
        moveWithin,
        (e) => {
          if (e.altKey) return;
          if (e.key === 'Escape') {
            refs.input.focus();
            reset();
          }
          // close results when task is opened
          if (e.key === ' ' || e.key === 'Enter') {
            state.showResults = false;
            reset();
          }
        },
      ],
      onClick: (e) => {
        if (e.target.dataset.name === 'open-btn') {
          state.showResults = false;
          reset();
        }
      },
    });
  };

  return html`
    <div
      :ref=${['self', refs]}
      class="group relative col-span-2 xs:col-span-1 xs:col-start-2 xs:row-start-1 sm:w-3/4 sm:max-w-2xl md:w-1/2 md:ml-56"
      onKeydown=${debounce(onNavigate, 50)}
    >
      <form
        :ref=${['form', refs]}
        role="search"
        class="justify-self-stretch flex items-center gap-1 sm:gap-2 px-3 rounded-full ring-sky-400 bg-gray-200 dark:bg-gray-100 focus-within:bg-white focus-within:ring-2 group-focus-within:ring-2 group-focus-within:bg-white hover:shadow-md dark:hover:shadow-slate-500"
        autocomplete="off"
      >
        <label for="search">
          <span class="sr-only"> Search tasks </span>
          <my-icon
            name="search"
            class="stroke-gray-600 group-hover:stroke-gray-700"
            decorative="true"
          />
        </label>
        <input
          :ref=${['input', refs]}
          class="flex-1 py-0.5 text-black bg-inherit focus:outline-none placeholder:text-sm"
          type="text"
          name="search"
          placeholder="Quick search (Ctrl+K)"
          onFocus=${toggleFocus}
          onBlur=${debounce(toggleFocus, 50)}
          onInput=${debounce(onChange, 300)}
        />
        <button
          type="button"
          class="text-xs text-gray-400 px-1 py-0.5 bg-transparent rounded-md hover:text-gray-600 invisible group-focus-within:visible"
          onClick=${toggleSearchMode}
        >
          <span class="sr-only">Mode:</span>
          ${state.$isComparisonAND((value) => (value ? 'AND' : 'OR'))}
        </button>
        <button
          type="reset"
          class="invisible group-focus-within:visible"
          onClick=${clearState}
        >
          <my-icon
            name="close"
            id="clear-search"
            title="Clear input"
            class="stroke-gray-600 hover:stroke-red-500"
          />
        </button>
      </form>
      <div
        :show=${state.$showResults}
        class="peer absolute top-8 left-0 right-0 p-1 divide-y-2 divide-gray-200 rounded-b-lg drop-shadow-lg bg-white dark:bg-[#272727] dark:divide-[#272727]"
        tabindex="-1"
        onLoad=${applyNavigation}
      >
        ${state.$results(renderResults)}
      </div>
    </div>
  `;
};

export default SearchBar;
