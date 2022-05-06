import format from 'date-fns/format';
import { createPopper } from '@popperjs/core';
import { createHook, html } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';
import Core from '../../core';
import { EDIT_TASK, TASK } from '../../core/actions';
import { POPPER_CONFIG } from '../../core/constants';
import { $ } from '../../utils/query';
import { dispatchCustomEvent } from '../../utils/dispatch';
import { formatToDateTime, getDueDateRange } from '../../utils/date';
import { useUndo } from '../../utils/undo';
import CreationPopup from './CreationPopup';

const Calendar = (projectId) => {
  const [state] = createHook({ date: new Date() });
  let calendar;

  /** wrappers */
  const createSchedule = (data, start, end) => {
    const schedule = {
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
      },
      borderColor: 'rgb(251 191 36)',
      bgColor: 'rgb(251 191 36)',
      dragBgColor: 'rgb(94 234 212)',
      customStyle:
        'font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; font-weight: 500; font-size: 0.875rem; line-height: 1.25rem;',
    };

    calendar.createSchedules([schedule]);
  };

  const updateSchedule = (id, calendarId, changes) => {
    calendar.updateSchedule(id, calendarId, changes);
  };

  const deleteSchedule = (id, calendarId) => {
    calendar.deleteSchedule(id, calendarId);
  };

  // const toggleSchedule = (calendarId, toHide) => {
  //   calendar.toggleSchedules(calendarId, toHide);
  // };

  const showTasks = () => {
    Core.main
      .getTasksFromProject(projectId)
      .filter((task) => task.dueDate)
      .forEach((task) => {
        createSchedule(task, ...getDueDateRange(task.dueDate));
      });
  };

  const setDate = () => {
    state.date = calendar.getDate().toDate();
    // to prevent creation popup from floating (having no ref)
    dispatchCustomEvent($('#creation-popup'), 'popup:close');
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
      clickSchedule: () =>
        dispatchCustomEvent($('#creation-popup'), 'popup:close'),
      beforeCreateSchedule: (e) => {
        const popup = $('#creation-popup');
        // make sure to close previous popup first
        dispatchCustomEvent(popup, 'popup:close');
        // change initial date
        dispatchCustomEvent(popup, 'datechange', { date: e.start.toDate() });
        // show popup
        dispatchCustomEvent(popup, 'popup:open');

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
        dispatchCustomEvent($('#creation-popup'), 'popup:close');

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
          text: 'Task removed',
          payload: { ...schedule.raw, id: schedule.id },
        })();
        deleteSchedule(schedule.id, schedule.calendarId);
      },
    });
  };

  const init = function () {
    calendar = new ToastUICalendar(this, {
      template,
      defaultView: 'month',
      taskView: false,
      usageStatistics: false,
      useDetailPopup: true,
    });

    initListeners();
    showTasks();
  };

  const destroy = () => {
    unsubscribe.forEach((cb) => cb());
    calendar.destroy();
  };

  /** listeners */
  const unsubscribe = [
    Core.event.onSuccess([TASK.ADD, TASK.INSERT], (data) => {
      if (data.dueDate) createSchedule(data, ...getDueDateRange(data.dueDate));
    }),
    Core.event.onSuccess(TASK.TRANSFER, ({ type, changes, result }) => {
      switch (type) {
        case 'project':
          if (changes.project.to === projectId && result.dueDate) {
            createSchedule(result, ...getDueDateRange(result.dueDate));
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
            },
          });
          break;

        default:
          throw new Error('Type must be either project, list, or task');
      }
    }),
    Core.event.onSuccess(TASK.UPDATE, (data) => {
      // check if there's an existing schedule
      const schedule = calendar.getSchedule(data.id, data.list);

      if (data.dueDate) {
        const [start, end] = getDueDateRange(data.dueDate);

        if (schedule) updateSchedule(data.id, data.list, { start, end });
        else createSchedule(data, start, end);
      } else {
        deleteSchedule(data.id, data.list);
      }
    }),
  ];

  return html`
    <div class="flex flex-row gap-1 mb-3" data-name="taskbar">
      <button
        class="bg-neutral-300 py-1 px-3 rounded-2xl active:ring shadow-sm"
        name="today"
        data-tooltip="${format(new Date(), 'MMMM dd, yyyy')}"
        onClick=${goToToday}
      >
        Today
      </button>
      <button
        class="bg-neutral-300 py-1 px-3 rounded-full active:ring shadow-sm"
        name="previous"
        data-tooltip="Previous"
        onClick=${previous}
      >
        <
      </button>
      <button
        class="bg-neutral-300 py-1 px-3 rounded-full active:ring shadow-sm"
        name="next"
        data-tooltip="Next"
        onClick=${next}
      >
        >
      </button>
      <h2 class="font-medium text-lg">
        ${state.$date((date) => format(date, 'MMMM yyyy'))}
      </h2>
    </div>
    <div data-name="calendar">
      <div onCreate=${init} onDestroy=${destroy}></div>
    </div>
    ${CreationPopup(projectId)}
  `;
};

export const template = {
  popupDetailDate: (...args) =>
    format(args[2].toDate(), 'MMMM d, yyyy hh:mm a'),
  popupDetailBody: (schedule) =>
    `<p class="truncate">${schedule.body.trim()}</p>`,
};

export default Calendar;
