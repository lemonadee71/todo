import format from 'date-fns/format';
import { createPopper } from '@popperjs/core';
import { createHook, html } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';
import Core from '../../core';
import { CHANGE_THEME, EDIT_TASK, TASK } from '../../actions';
import { POPPER_CONFIG } from '../../constants';
import { $ } from '../../utils/query';
import { dispatchCustom } from '../../utils/dispatch';
import { formatToDateTime, getDateRange } from '../../utils/date';
import { useUndo } from '../../utils/undo';
import CreationPopup from './CreationPopup';

const Calendar = (projectId) => {
  const [state] = createHook({ date: new Date() });
  let cleanup = [];
  let calendar;

  const closeCreationPopup = () =>
    dispatchCustom('popup:close', $('#creation-popup'));

  /** wrappers */
  const createScheduleObject = (data) => {
    const [start, end] = getDateRange(data.dueDate);
    const project = Core.main.getProject(projectId);

    return {
      start,
      end,
      id: data.id,
      calendarId: data.list,
      category: 'time',
      title: data.title,
      body: data.notes,
      raw: {
        project: data.project,
        list: data.list,
        task: data.id,
        completed: data.completed,
      },
      borderColor: project.color,
      // top line color of detail popup
      bgColor: project.color,
      dragBgColor: 'rgb(94 234 212)',
      customStyle:
        'font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; font-weight: 500; font-size: 0.875rem; line-height: 1.25rem;',
    };
  };

  const createSchedule = (data) => {
    calendar.createSchedules([createScheduleObject(data)]);
  };

  const updateSchedule = (id, calendarId, changes) => {
    calendar.updateSchedule(id, calendarId, changes);
  };

  const deleteSchedule = (id, calendarId) => {
    calendar.deleteSchedule(id, calendarId);
  };

  const showTasks = () => {
    Core.main
      .getTasksFromProject(projectId)
      .filter((task) => task.dueDate)
      .forEach((task) => createSchedule(task));
  };

  const setDate = () => {
    state.date = calendar.getDate().toDate();
    // to prevent creation popup from floating (having no ref)
    closeCreationPopup();
  };

  const goToToday = () => {
    calendar.today();
    setDate();
  };

  const previous = () => {
    calendar.prev();
    setDate();
  };

  const next = () => {
    calendar.next();
    setDate();
  };

  /** core */
  const initListeners = () => {
    calendar.on({
      clickSchedule: () => {
        closeCreationPopup();
        $('.tui-full-calendar-popup-container').classList.add(
          'dark:bg-[#353535]'
        );
      },
      beforeCreateSchedule: (e) => {
        const popup = $('#creation-popup');
        // make sure to close previous popup first
        dispatchCustom('popup:close', popup);
        // change initial date
        dispatchCustom('datechange', popup, { date: e.start.toDate() });
        // show popup
        dispatchCustom('popup:open', popup);

        // init popper
        const ref =
          e.guide.guideElement ?? Object.values(e.guide.guideElements)[0];
        const instance = createPopper(ref, popup, {
          ...POPPER_CONFIG,
          placement: 'right',
        });

        popup.addEventListener(
          'popup:close',
          () => {
            e.guide.clearGuideElement();
            instance.destroy();
          },
          { once: true }
        );
      },
      beforeUpdateSchedule: ({ schedule, changes }) => {
        closeCreationPopup();

        const location = schedule.raw;

        if (changes) {
          Core.event.emit(TASK.UPDATE, {
            ...location,
            data: { dueDate: formatToDateTime(changes.end.toDate()) },
          });
        } else {
          Core.event.emit(
            EDIT_TASK,
            Core.main.getTask(location.project, location.list, location.task)
          );
        }
      },
      beforeDeleteSchedule: ({ schedule }) => {
        useUndo({
          type: TASK,
          message: 'Task removed',
          data: { ...schedule.raw, id: schedule.id },
        })();
      },
    });

    /** listeners */
    cleanup = [
      Core.event.onSuccess(CHANGE_THEME, () => {
        // BUG: each theme should have the same set of keys or else
        //      styles will be inherited from predecessor for every
        //      missing keys in the new theme
        calendar.setTheme(Core.state.darkTheme ? darkTheme : lightTheme);
      }),
      Core.event.onSuccess([TASK.ADD, TASK.INSERT], (data) => {
        if (data.dueDate) createSchedule(data);
      }),
      Core.event.onSuccess(TASK.REMOVE, (data) => {
        deleteSchedule(data.id, data.list);
      }),
      Core.event.onSuccess(TASK.TRANSFER, ({ type, changes, result }) => {
        switch (type) {
          case 'project':
            if (changes.project.to === projectId && result.dueDate) {
              createSchedule(result);
            } else {
              deleteSchedule(result.id, changes.list.from);
            }

            break;
          case 'list':
            updateSchedule(result.id, changes.list.from, {
              calendarId: changes.list.to,
              raw: {
                project: result.project,
                list: result.list,
                task: result.id,
                completed: result.completed,
              },
            });
            break;

          default:
            throw new Error('Type must be either project, list, or task');
        }
      }),
      Core.event.onSuccess(TASK.UPDATE, (data) => {
        if (data.dueDate) {
          // check if there's an existing schedule
          const schedule = calendar.getSchedule(data.id, data.list);

          if (schedule)
            updateSchedule(data.id, data.list, createScheduleObject(data));
          else createSchedule(data);
        } else {
          deleteSchedule(data.id, data.list);
        }
      }),
    ];
  };

  const init = function () {
    calendar = new ToastUICalendar(this, {
      template,
      defaultView: 'month',
      taskView: false,
      usageStatistics: false,
      useDetailPopup: true,
      theme: Core.state.darkTheme ? darkTheme : lightTheme,
    });

    initListeners();
    showTasks();
  };

  const destroy = () => {
    cleanup.forEach((cb) => cb());
    calendar.destroy();
  };

  return html`
    <div class="flex gap-1 mb-3" data-name="taskbar">
      <button
        class="hover:bg-neutral-200 dark:hover:bg-neutral-700 py-1 px-3 rounded border border-solid border-neutral-600 active:ring active:ring-inset shadow-sm"
        name="today"
        data-tooltip="${format(new Date(), 'eee, MMMM dd')}"
        onClick=${goToToday}
      >
        Today
      </button>
      <button
        class="hover:bg-neutral-200 dark:hover:bg-neutral-700 py-1 px-3 rounded-full active:ring active:ring-inset shadow-sm"
        name="previous"
        data-tooltip="Previous week"
        onClick=${previous}
      >
        <
      </button>
      <button
        class="hover:bg-neutral-200 dark:hover:bg-neutral-700 py-1 px-3 rounded-full active:ring active:ring-inset shadow-sm"
        name="next"
        data-tooltip="Next week"
        onClick=${next}
      >
        >
      </button>
      <h2 class="font-medium text-lg">
        ${state.$date((date) => format(date, 'MMMM yyyy'))}
      </h2>
    </div>
    <div data-name="calendar" onCreate=${init} onDestroy=${destroy}></div>
    ${CreationPopup(projectId)}
  `;
};

const template = {
  time: (schedule) =>
    // prettier-ignore
    // workaround since we can't update customStyle
    `<span class="text-[#333] dark:text-white" style="text-decoration-line: ${schedule.raw.completed ? 'line-through' : 'none'};">
      ${schedule.title}
    </span>`,
  monthMoreTitleDate: (date, dayname) => {
    const day = date.split('.')[2];

    return `
      <span class="tui-full-calendar-month-more-title-day text-[#333] dark:text-white">${day}</span>
      <span class="tui-full-calendar-month-more-title-day-label text-[#333] dark:text-white">${dayname}</span>      
    `;
  },
  popupDetailDate: (...args) =>
    format(args[2].toDate(), 'MMMM d, yyyy hh:mm a'),
  popupDetailBody: (schedule) =>
    `<p class="line-clamp-3">${schedule.body.trim()}</p>`,
  // Icons are not visible for these buttons in dark mode
  // since we can't change their color
  popupEdit: () => '<span>Edit</span>',
  popupDelete: () => '<span class="hover:text-red-500">Delete</span>',
};

const lightTheme = {
  'common.border': '1px solid #e5e5e5',
  'common.backgroundColor': 'inherit',
  'common.saturday.color': '#333',
  'common.dayname.color': '#333',
  'month.dayname.borderLeft': '1px solid #e5e5e5',
  'month.dayExceptThisMonth.color': 'rgba(51, 51, 51, 0.4)',
  'month.moreView.backgroundColor': 'white',
};

const darkTheme = {
  'common.border': '1px solid rgb(107 114 128)',
  'common.backgroundColor': 'inherit',
  'common.saturday.color': 'white',
  'common.dayname.color': 'white',
  'month.dayname.borderLeft': '1px solid rgb(107 114 128)',
  'month.dayExceptThisMonth.color': 'gray',
  'month.moreView.backgroundColor': '#202020',
};

export default Calendar;
