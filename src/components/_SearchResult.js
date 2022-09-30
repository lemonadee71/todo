import { html } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../constants';
import { runOnlyIfClick } from '../utils/keyboard';

const SearchResult = (data, isBestMatch = false) => {
  const template = {
    main: {
      'class:group': true,
      tabindex: '-1',
      onKeydown: [
        runOnlyIfClick((e) => e.target.setAttribute('tabindex', '-1')),
        (e) => {
          if (e.key === 'Tab' || e.key === 'Escape') {
            e.target.setAttribute('tabindex', '-1');
          }
        },
      ],
    },
    openButton: {
      'data-name': 'open-btn',
      onClick: (e) => {
        e.currentTarget.closest('.task').setAttribute('tabindex', '-1');
      },
    },
  };

  const badges = [
    isBestMatch &&
      html`<common-badge
        background=${DEFAULT_COLORS.blue}
        props=${{ _key: 'best-match' }}
      >
        Best match
      </common-badge>`,
  ];

  return html`
    <global-task data=${data} badges=${badges} template=${template} />
  `;
};

export default SearchResult;
