import { html } from 'poor-man-jsx';

const createIcon =
  (content) =>
  (cls = '', size = 20, stroke = 1.5, color = '#000000') =>
    html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="${cls}"
        width="${size}"
        height="${size}"
        viewBox="0 0 24 24"
        stroke-width="${stroke}"
        stroke="${color}"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        ${content}
      </svg>
    `;

export const AddIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <line x1="12" y1="5" x2="12" y2="19" />
  <line x1="5" y1="12" x2="19" y2="12" />
`);

export const DeleteIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <line x1="4" y1="7" x2="20" y2="7" />
  <line x1="10" y1="11" x2="10" y2="17" />
  <line x1="14" y1="11" x2="14" y2="17" />
  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
`);

export const CloseIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
`);

export const EditIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
`);

export const KebabMenuIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <circle cx="12" cy="12" r="1" />
  <circle cx="12" cy="19" r="1" />
  <circle cx="12" cy="5" r="1" />
`);

export const CalendarIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <rect x="4" y="5" width="16" height="16" rx="2" />
  <line x1="16" y1="3" x2="16" y2="7" />
  <line x1="8" y1="3" x2="8" y2="7" />
  <line x1="4" y1="11" x2="20" y2="11" />
  <line x1="11" y1="15" x2="12" y2="15" />
  <line x1="12" y1="15" x2="12" y2="18" />
`);

export const ListIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <line x1="9" y1="6" x2="20" y2="6" />
  <line x1="9" y1="12" x2="20" y2="12" />
  <line x1="9" y1="18" x2="20" y2="18" />
  <line x1="5" y1="6" x2="5" y2="6.01" />
  <line x1="5" y1="12" x2="5" y2="12.01" />
  <line x1="5" y1="18" x2="5" y2="18.01" />
`);

export const LabelIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
  <path
    d="M4 7v3.859c0 .537 .213 1.052 .593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834 -4.834a2.025 2.025 0 0 0 0 -2.864l-8.117 -8.116a2.025 2.025 0 0 0 -1.431 -.593h-3.859a3 3 0 0 0 -3 3z"
  />
`);

export const NotesIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <rect x="5" y="3" width="14" height="18" rx="2" />
  <line x1="9" y1="7" x2="15" y2="7" />
  <line x1="9" y1="11" x2="15" y2="11" />
  <line x1="9" y1="15" x2="13" y2="15" />
`);

export const SubtasksIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />
  <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />
  <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />
  <line x1="11" y1="6" x2="20" y2="6" />
  <line x1="11" y1="12" x2="20" y2="12" />
  <line x1="11" y1="18" x2="20" y2="18" />
`);

export const HomeIcon = createIcon(`
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <polyline points="5 12 3 12 12 3 21 12 19 12" />
  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
`);
